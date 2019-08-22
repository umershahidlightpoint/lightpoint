using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Mappers;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountService : IAccountService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        private readonly EntityMapper mapper = new EntityMapper();
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public object Data(string symbol, string search = "")
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                    result = AllData();
                    Utils.Save(result, "accounts");
                    break;
                case "Search":
                    result = Search(search);
                    break;
            }

            return result;
        }

        public object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory)
        {
            dynamic postingEngine = new PostingEngineService().IsPostingEngineRunning();

            if (postingEngine.IsRunning)
            {
                
                return Utils.Wrap(false, "Posting Engine is currently Running");
            }

            SqlHelper sqlHelper = new SqlHelper(connectionString);
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("pageNumber", pageNumber), new SqlParameter("pageSize", pageSize),
                new SqlParameter("accountName", accountName), new SqlParameter("accountCategory", accountCategory)
            };

            var query = new StringBuilder($@"SELECT total = COUNT(*) OVER()
                        ,[account].[id] AS 'account_id'
                        ,[account].[name]
	                    ,[account].[description]
						,[account_type].[id] AS 'type_id'
	                    ,[account_type].[name] AS 'type'
                        ,[account_category].[id] AS 'category_id'
	                    ,[account_category].[name] AS 'category'
	                    ,CASE WHEN EXISTS (SELECT TOP 1 [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'Yes'
	                    ELSE 'No'
	                    END AS 'has_journal'
                        FROM [account]
						LEFT JOIN [account_type] ON [account].[account_type_id] = [account_type].[id]
						LEFT JOIN [account_category] ON [account_type].[account_category_id] = [account_category].[id]");

            query.Append(accountName.Length > 0 ? " WHERE [account].[name] LIKE '%'+@accountName+'%'" : "");

            query.Append(accountName.Length > 0
                ? (accountCategory.Length > 0 ? " AND [account_category].[name] LIKE '%'+@accountCategory+'%'" : "")
                : (accountCategory.Length > 0 ? " WHERE [account_category].[name] LIKE '%'+@accountCategory+'%'" : ""));

            query.Append(
                " ORDER BY [account].[id] DESC OFFSET(@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY");

            List<AccountsOutputDto> accounts = new List<AccountsOutputDto>();
            MetaData meta = new MetaData();
            using (var reader =
                sqlHelper.GetDataReader(query.ToString(), CommandType.Text, sqlParameters.ToArray(),
                    out var sqlConnection))
            {
                while (reader.Read())
                {
                    meta.Total = (int) reader["total"];
                    accounts.Add(mapper.MapAccounts(reader));
                }

                reader.Close();
                sqlConnection.Close();
            }

            Logger.Info($"GetAccounts Executed at {DateTime.Now}");
            return Utils.Wrap(true, accounts, meta);
        }

        public object GetAccount(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id)
            };

            var query = $@"SELECT [account].[id] AS 'account_id'
                        ,[account].[name]
	                    ,[account].[description]
						,[account_type].[id] AS 'type_id'
	                    ,[account_type].[name] AS 'type'
                        ,[account_category].[id] AS 'category_id'
	                    ,[account_category].[name] AS 'category'
                        ,[account_tag].[tag_id]
						,[account_tag].[tag_value]
	                    ,CASE WHEN EXISTS (SELECT TOP 1 [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'Yes'
	                    ELSE 'No'
	                    END AS 'has_journal'
                        FROM [account]
						LEFT JOIN [account_type] ON [account].[account_type_id] = [account_type].[id]
						LEFT JOIN [account_category] ON [account_type].[account_category_id] = [account_category].[id]
						LEFT JOIN [account_tag] ON [account].[id] = [account_tag].[account_id]
						WHERE [account].[id] = @id";

            List<AccountOutputDto> account = new List<AccountOutputDto>();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, sqlParameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    account.Add(mapper.MapAccount(reader));
                }

                reader.Close();
                sqlConnection.Close();
            }

            var result = account.GroupBy(accounts => accounts.AccountId)
                .Select(group => new AccountOutputDto
                {
                    AccountId = group.Key,
                    AccountName = group.FirstOrDefault()?.AccountName,
                    Description = group.FirstOrDefault()?.Description,
                    TypeId = group.FirstOrDefault()?.TypeId,
                    Type = group.FirstOrDefault()?.Type,
                    CategoryId = group.FirstOrDefault()?.CategoryId,
                    Category = group.FirstOrDefault()?.Category,
                    HasJournal = group.FirstOrDefault()?.HasJournal,
                    CanDeleted = group.FirstOrDefault()?.HasJournal == "No",
                    CanEdited = group.FirstOrDefault()?.HasJournal == "No",
                    Tags = group.SelectMany(tag => tag.Tags).ToList()
                })
                .ToList();

            Logger.Info($"GetAccount Executed at {DateTime.Now}");
            return Utils.Wrap(true, result, null);
        }

        public object CreateAccount(AccountInputDto account)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var accountName = GetAccountName(account.Tags, account.Type);
                List<SqlParameter> accountParameters = new List<SqlParameter>
                {
                    new SqlParameter("name", accountName), new SqlParameter("description", account.Description),
                    new SqlParameter("type", account.Type)
                };

                var accountQuery = $@"INSERT INTO [account]
                        ([name]
                        ,[description]
                        ,[account_type_id])
                        VALUES
                        (@name
                        ,@description
                        ,@type)
                        SELECT SCOPE_IDENTITY() AS 'Identity'";

                sqlHelper.Insert(accountQuery, CommandType.Text, accountParameters.ToArray(), out int accountId);

                if (account.Tags.Count > 0)
                {
                    foreach (var accountTag in account.Tags)
                    {
                        List<SqlParameter> tagParameters = new List<SqlParameter>
                        {
                            new SqlParameter("accountId", accountId), new SqlParameter("tagId", accountTag.Id),
                            new SqlParameter("tagValue", accountTag.Value)
                        };

                        var tagQuery = $@"INSERT INTO [account_tag]
                                ([account_id]
                                ,[tag_id]
                                ,[tag_value])
                                VALUES
                                (@accountId
                                ,@tagId
                                ,@tagValue)";

                        sqlHelper.Insert(tagQuery, CommandType.Text, tagParameters.ToArray());
                    }
                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        public object UpdateAccount(int id, AccountInputDto account)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (AccountHasJournal(id))
            {
                return Utils.Wrap(false, "An Account having Journal cannot be Edited");
            }

            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var accountName = GetAccountName(account.Tags, account.Type);
                List<SqlParameter> accountParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id), new SqlParameter("name", accountName),
                    new SqlParameter("description", account.Description),
                    new SqlParameter("type", account.Type)
                };

                List<SqlParameter> tagDeleteParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id)
                };

                var accountQuery = $@"UPDATE [account]
                                    SET [name] = @name
                                    ,[description] = @description
                                    ,[account_type_id] = @type
                                    WHERE [id] = @id";

                var tagDeleteQuery = $@"DELETE FROM [account_tag]
                                    WHERE [account_tag].[account_id] = @id";

                sqlHelper.Update(accountQuery, CommandType.Text, accountParameters.ToArray());
                sqlHelper.Delete(tagDeleteQuery, CommandType.Text, tagDeleteParameters.ToArray());

                if (account.Tags.Count > 0)
                {
                    foreach (var accountTag in account.Tags)
                    {
                        List<SqlParameter> tagParameters = new List<SqlParameter>
                        {
                            new SqlParameter("accountId", id), new SqlParameter("tagId", accountTag.Id),
                            new SqlParameter("tagValue", accountTag.Value)
                        };

                        var tagQuery = $@"INSERT INTO [account_tag]
                                ([account_id]
                                ,[tag_id]
                                ,[tag_value])
                                VALUES
                                (@accountId
                                ,@tagId
                                ,@tagValue)";

                        sqlHelper.Insert(tagQuery, CommandType.Text, tagParameters.ToArray());
                    }
                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        public object PatchAccount(int id, AccountInputPatchDto account)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> accountParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id), new SqlParameter("description", account.Description)
            };

            var accountQuery = $@"UPDATE [account]
                                    SET [description] = @description
                                    WHERE [id] = @id";

            try
            {
                sqlHelper.VerifyConnection();

                sqlHelper.Update(accountQuery, CommandType.Text, accountParameters.ToArray());
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();

                Console.WriteLine($"Patch Account Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        public object DeleteAccount(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (AccountHasJournal(id))
            {
                return Utils.Wrap(false, "An Account having Journal cannot be Deleted");
            }

            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                List<SqlParameter> tagParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id)
                };

                List<SqlParameter> accountParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id)
                };

                var tagQuery = $@"DELETE FROM [account_tag]
                                WHERE [account_tag].[account_id] = @id";

                var accountQuery = $@"DELETE FROM [account]
                                    WHERE [id] = @id";

                sqlHelper.Delete(tagQuery, CommandType.Text, tagParameters.ToArray());
                sqlHelper.Delete(accountQuery, CommandType.Text, accountParameters.ToArray());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        private bool AccountHasJournal(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id)
            };

            var query = $@"SELECT 
                        CASE WHEN EXISTS (SELECT TOP 1 [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'true'
	                    ELSE 'false'
	                    END AS 'has_journal'
                        FROM [account]
	                    WHERE [account].[id] = @id";

            var hasJournal = sqlHelper.GetScalarValue(query, CommandType.Text, sqlParameters.ToArray());

            return Convert.ToBoolean(hasJournal);
        }

        private string GetAccountName(List<AccountTagInputDto> accountTags, int? accountType)
        {
            return accountTags.Count > 0
                ? String.Join("-", accountTags.Select(tag => tag.Value))
                : GetAccountTypeName(accountType);
        }

        private string GetAccountTypeName(int? accountTypeId)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> accountTypeParameters = new List<SqlParameter>
            {
                new SqlParameter("typeId", accountTypeId)
            };

            var accountTypeQuery = $@"SELECT [name]
                                        FROM [account_type]
                                        WHERE [account_type].[id] = @typeId";

            return sqlHelper.GetScalarValue(accountTypeQuery, CommandType.Text, accountTypeParameters.ToArray())
                .ToString();
        }

        private object AllData()
        {
            var query = $@"SELECT * FROM [account]";

            return Utils.GetTable(connectionString, "account");
        }

        private object Search(string search)
        {
            var query = $@"SELECT * FROM [account] where [name] like '%" + search + "%'";

            return Utils.GetTable(connectionString, "account");
        }
    }
}