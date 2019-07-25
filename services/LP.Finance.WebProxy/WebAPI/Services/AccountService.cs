using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountService : IAccountControllerService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

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
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("pageNumber", pageNumber), new SqlParameter("pageSize", pageSize),
                new SqlParameter("accountName", accountName), new SqlParameter("accountCategory", accountCategory)
            };

            var query = $@"SELECT total = COUNT(*) OVER()
                        ,[account].[id] AS 'account_id'
                        ,[account].[name]
	                    ,[account].[description]
                        ,[account_category].[id] AS 'category_id'
	                    ,[account_category].[name] AS 'category' 
                        ,[account_tag].[tag_id]
						,[account_tag].[tag_value]
	                    ,CASE WHEN EXISTS (SELECT [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'Yes' 
	                    ELSE 'No'
	                    END AS 'has_journal'
                        FROM [account] JOIN [account_category] ON [account].[account_category_id] = [account_category].[id]
                        JOIN [account_tag] ON [account].[id] = [account_tag].[account_id]";

            query += accountName.Length > 0 ? " WHERE [account].[name] LIKE '%'+@accountName+'%'" : "";

            query += accountName.Length > 0
                ? (accountCategory.Length > 0 ? " AND [account_category].[name] LIKE '%'+@accountCategory+'%'" : "")
                : (accountCategory.Length > 0 ? " WHERE [account_category].[name] LIKE '%'+@accountCategory+'%'" : "");

            query +=
                " ORDER BY [account].[id] DESC OFFSET(@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY";

            List<AccountOutputDto> accounts = new List<AccountOutputDto>();
            metaData metaData = new metaData();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, sqlParameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    metaData.total = (int) reader["total"];
                    accounts.Add(new AccountOutputDto
                    {
                        AccountId = (int) reader["account_id"],
                        AccountName = reader["name"].ToString(),
                        Description = reader["description"].ToString(),
                        CategoryId = (int) reader["category_id"],
                        Category = reader["category"].ToString(),
                        HasJournal = reader["has_journal"].ToString(),
                        Tags = new List<TagDto>
                            {new TagDto {Id = (int) reader["tag_id"], Value = reader["tag_value"].ToString()}}
                    });
                }
            }

            var result = accounts.GroupBy(account => account.AccountId)
                .Select(group => new AccountOutputDto
                {
                    AccountId = group.Key,
                    AccountName = group.FirstOrDefault()?.AccountName,
                    Description = group.FirstOrDefault()?.Description,
                    CategoryId = group.FirstOrDefault().CategoryId,
                    Category = group.FirstOrDefault()?.Category,
                    HasJournal = group.FirstOrDefault()?.HasJournal,
                    Tags = group.SelectMany(tag => tag.Tags).ToList()
                })
                .ToList();

            return Utils.Wrap(true, result, metaData);
        }

        public object CreateAccount(AccountDto account)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var accountName = String.Join("-", account.Tags.Select(tag => tag.Value));
                List<SqlParameter> accountParameters = new List<SqlParameter>
                {
                    new SqlParameter("name", accountName), new SqlParameter("description", account.Description),
                    new SqlParameter("category", account.Category)
                };

                var accountQuery = $@"INSERT INTO [account]
                        ([name]
                        ,[description]
                        ,[account_category_id])
                        VALUES
                        (@name
                        ,@description
                        ,@category)
                        SELECT SCOPE_IDENTITY() AS 'Identity'";

                sqlHelper.Insert(accountQuery, CommandType.Text, accountParameters.ToArray(), out int accountId);

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

        public object UpdateAccount(int id, AccountDto account)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var accountName = String.Join("-", account.Tags.Select(tag => tag.Value));
                List<SqlParameter> accountParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id), new SqlParameter("name", accountName),
                    new SqlParameter("description", account.Description),
                    new SqlParameter("category", account.Category)
                };

                List<SqlParameter> tagDeleteParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id)
                };

                var accountQuery = $@"UPDATE [account]
                                    SET [name] = @name
                                    ,[description] = @description
                                    ,[account_category_id] = @category
                                    WHERE [id] = @id";

                var tagDeleteQuery = $@"DELETE FROM [account_tag]
                                    WHERE [account_tag].[account_id] = @id";

                sqlHelper.Update(accountQuery, CommandType.Text, accountParameters.ToArray());
                sqlHelper.Delete(tagDeleteQuery, CommandType.Text, tagDeleteParameters.ToArray());

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

        public object DeleteAccount(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (CanBeDeleted(id))
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

        private bool CanBeDeleted(int id)
        {
            return AccountHasJournal(id);
        }

        private bool AccountHasJournal(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id)
            };

            var query = $@"SELECT 
                        CASE WHEN EXISTS 
                        (SELECT TOP 1 [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'true'
                        ELSE 'false'
	                    END AS 'has_journal'
                        FROM [account] JOIN [account_category] ON [account].[account_category_id] = [account_category].[id]
	                    WHERE [account].[id] = @id";

            var hasJournal = sqlHelper.GetScalarValue(query, CommandType.Text, sqlParameters.ToArray());

            return Convert.ToBoolean(hasJournal);
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