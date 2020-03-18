using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Mappers;
using LP.Finance.Common.Model;
using LP.Shared.FileMetaData;
using LP.Shared.Sql;
using Newtonsoft.Json;

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
                    Shared.WebApi.Save(result, "accounts");
                    break;
                case "Search":
                    result = Search(search);
                    break;
            }

            return result;
        }

        public object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory)
        {
            dynamic postingEngine = new PostingEngineService().GetProgress();

            if (postingEngine.IsRunning)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
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
                " ORDER BY [account].[id] DESC");

//            query.Append(
//                " OFFSET(@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY");

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
            return Shared.WebApi.Wrap(true, accounts, HttpStatusCode.OK, null, meta);
        }

        public object GetDummyAccount()
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                var data = FetchDummyAccount(sqlHelper);
                if (data.Item1)
                {
                    return data.Item2;
                }
                else
                {
                    SetUpDummyAccount(sqlHelper);
                    return FetchDummyAccount(sqlHelper).Item2;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static Tuple<bool, object> FetchDummyAccount(SqlHelper sqlHelper)
        {
            var query = new StringBuilder($@"SELECT [account].[id] AS 'account_id'
                        ,[account].[name]
	                    ,[account].[description]
						,[account_type].[id] AS 'type_id'
	                    ,[account_type].[name] AS 'type'
                        ,[account_category].[id] AS 'category_id'
	                    ,[account_category].[name] AS 'category'
                        FROM [account]
						LEFT JOIN [account_type] ON [account].[account_type_id] = [account_type].[id]
						LEFT JOIN [account_category] ON [account_type].[account_category_id] = [account_category].[id]
						WHERE [account_category].[id] = 0");

            var data = sqlHelper.GetDataTable(query.ToString(), CommandType.Text);

            if (data.Rows.Count > 0)
            {
                var dummyAccount = new AccountsOutputDto
                {
                    AccountId = Convert.ToInt32(data.Rows[0]["account_id"]),
                    AccountName = data.Rows[0]["name"].ToString(),
                    Description = data.Rows[0]["description"].ToString(),
                    TypeId = Convert.ToInt32(data.Rows[0]["type_id"]),
                    Type = data.Rows[0]["type"].ToString(),
                    CategoryId = Convert.ToInt32(data.Rows[0]["category_id"]),
                    Category = data.Rows[0]["category"].ToString()
                };

                return new Tuple<bool, object>(true, Shared.WebApi.Wrap(true, dummyAccount, HttpStatusCode.OK));
            }
            else
            {
                return new Tuple<bool, object>(false, Shared.WebApi.Wrap(false, null, HttpStatusCode.OK));
            }
        }

        private void SetUpDummyAccount(SqlHelper sqlHelper)
        {
            SqlHelper s = new SqlHelper(connectionString);
            try
            {
                int? accountCategoryId = null;
                int? accountTypeId = null;
                var accountCategoryQuery = "select id from account_category where id = 0";
                var accountCategoryData = sqlHelper.GetDataTable(accountCategoryQuery.ToString(), CommandType.Text);
                if (accountCategoryData.Rows.Count == 1)
                {
                    //account category exists
                    accountCategoryId = Convert.ToInt32(accountCategoryData.Rows[0]["id"]);
                }

                var accountTypeQuery = "select id from account_type where account_category_id = 0";
                var accountTypeData = sqlHelper.GetDataTable(accountTypeQuery.ToString(), CommandType.Text);
                if (accountTypeData.Rows.Count == 1)
                {
                    //account type exists
                    accountTypeId = Convert.ToInt32(accountTypeData.Rows[0]["id"]);
                }


                s.VerifyConnection();
                s.SqlBeginTransaction();

                if (!accountCategoryId.HasValue)
                {
                    //create account category
                    var q = $@"INSERT INTO [dbo].[account_category]
                           ([id]
                           ,[name])
                     VALUES
                           (0
                           ,N'Dummy')";
                    s.Insert(q, CommandType.Text, null, out int accCatId);
                    accountCategoryId = 0;
                }

                if (!accountTypeId.HasValue)
                {
                    //create account type
                    var q = $@"INSERT INTO [dbo].[account_type]
                           ([account_category_id]
                           ,[name])
                     VALUES
                           ({accountCategoryId.Value}
                           ,N'Dummy Type')
                            SELECT SCOPE_IDENTITY() AS 'Identity'";

                    s.Insert(q, CommandType.Text, null, out int accTypId);
                    accountTypeId = accTypId;
                }

                if (accountCategoryId.HasValue && accountTypeId.HasValue)
                {
                    //simply create account
                    var q = $@"INSERT INTO [dbo].[account]
                               ([name]
                               ,[description]
                               ,[account_type_id])
                         VALUES
                               ('Dummy Account'
                               ,'Default Account'
                               ,{accountTypeId.Value})";

                    s.Insert(q, CommandType.Text, null, out int accId);
                }

                s.SqlCommitTransaction();
            }
            catch (Exception ex)
            {
                s.SqlRollbackTransaction();
                throw ex;
            }
            finally
            {
                s.CloseConnection();
            }
        }

        public object GetMappedAccounts()
        {
            dynamic postingEngine = new PostingEngineService().GetProgress();

            if (postingEngine.IsRunning)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
            }

            try
            {
                SqlHelper sqlHelper = new SqlHelper(connectionString);

                var query = new StringBuilder($@"SELECT [account].[id] AS 'account_id'
                                                ,[account].[name]
	                                            ,[account].[description]
						                        ,[account_type].[id] AS 'type_id'
	                                            ,[account_type].[name] AS 'type'
                                                ,[account_category].[id] AS 'category_id'
	                                            ,[account_category].[name] AS 'category'
						                        ,[m].[id] AS 'map_id'
                                                ,[m].[third_party_account_id]
						                        ,[t].[third_party_account_name] AS 'third_party_account_name'
						                        ,[org].[organization_name] AS 'organization_name'
                                                FROM [account]
						                        LEFT JOIN [account_type] ON [account].[account_type_id] = [account_type].[id]
						                        LEFT JOIN [account_category] ON [account_type].[account_category_id] = [account_category].[id]
						                        LEFT JOIN [account_to_third_party_account_mapping] [m] ON [account].[id] = [m].[account_id]
						                        LEFT JOIN [third_party_account] [t] ON [m].[third_party_account_id] = [t].[id]
						                        LEFT JOIN [third_party_organization] [org] ON [t].[third_party_organization_id] = [org].[id]");

                List<AccountsOutputDto> accounts = new List<AccountsOutputDto>();
                using (var reader =
                    sqlHelper.GetDataReader(query.ToString(), CommandType.Text, null,
                        out var sqlConnection))
                {
                    while (reader.Read())
                    {
                        accounts.Add(mapper.MapThirdPartyMappedAccounts(reader));
                    }

                    reader.Close();
                    sqlConnection.Close();
                }

                var result = accounts.GroupBy(account => account.AccountId)
                    .Select(group => new AccountsOutputDto
                    {
                        AccountId = group.Key,
                        AccountName = group.FirstOrDefault()?.AccountName,
                        Description = group.FirstOrDefault()?.Description,
                        TypeId = group.FirstOrDefault()?.TypeId,
                        Type = group.FirstOrDefault()?.Type,
                        CategoryId = group.FirstOrDefault()?.CategoryId,
                        Category = group.FirstOrDefault()?.Category,
                        HasMapping = group.FirstOrDefault()?.HasMapping,
                        ThirdPartyMappedAccounts = group.SelectMany(mapped => mapped.ThirdPartyMappedAccounts).ToList()
                    })
                    .ToList();

                Logger.Info($"GetMappedAccounts Executed at {DateTime.Now}");
                return Shared.WebApi.Wrap(true, result, HttpStatusCode.OK, null, null);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
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
            return Shared.WebApi.Wrap(true, result, null);
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
                return Shared.WebApi.Wrap(false);
            }

            return Shared.WebApi.Wrap(true);
        }

        public object UpdateAccount(int id, AccountInputDto account)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (AccountHasJournal(id))
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "An Account having Journal cannot be Edited");
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
                return Shared.WebApi.Wrap(false);
            }

            return Shared.WebApi.Wrap(true);
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
                return Shared.WebApi.Wrap(false);
            }

            return Shared.WebApi.Wrap(true);
        }

        public object DeleteAccount(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (AccountHasJournal(id))
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK,
                    "An Account having Journal cannot be Deleted");
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
                return Shared.WebApi.Wrap(false);
            }

            return Shared.WebApi.Wrap(true);
        }

        public object GetThirdPartyOrganizationAccounts()
        {
            try
            {
                SqlHelper sqlHelper = new SqlHelper(connectionString);

                var query = $@"SELECT [third_party_organization].[id] AS 'organization_id', 
		                        [third_party_organization].[organization_name],
		                        [third_party_account].[id] AS 'account_id',
		                        [third_party_account].[third_party_account_code],
		                        [third_party_account].[third_party_account_name]
		                        FROM [third_party_organization] JOIN [third_party_account] 
		                        ON [third_party_organization].[id] = [third_party_account].[third_party_organization_id]";

                List<ThirdPartyOrganizationAccountsOutputDto> thirdPartyOrganizationAccounts =
                    new List<ThirdPartyOrganizationAccountsOutputDto>();
                using (var reader =
                    sqlHelper.GetDataReader(query, CommandType.Text, null, out var sqlConnection))
                {
                    while (reader.Read())
                    {
                        thirdPartyOrganizationAccounts.Add(new ThirdPartyOrganizationAccountsOutputDto
                        {
                            OrganizationId = (int) reader["organization_id"],
                            OrganizationName = reader["organization_name"].ToString(),
                            Accounts = new List<ThirdPartyAccountsOutputDto>
                            {
                                new ThirdPartyAccountsOutputDto
                                {
                                    AccountId = (int) reader["account_id"],
                                    AccountCode = reader["third_party_account_code"].ToString(),
                                    AccountName = reader["third_party_account_name"].ToString()
                                }
                            }
                        });
                    }

                    reader.Close();
                    sqlConnection.Close();
                }

                var result = thirdPartyOrganizationAccounts.GroupBy(account => account.OrganizationId)
                    .Select(group => new ThirdPartyOrganizationAccountsOutputDto
                    {
                        OrganizationId = group.Key,
                        OrganizationName = group.FirstOrDefault()?.OrganizationName,
                        Accounts = group.SelectMany(element => element.Accounts).ToList()
                    })
                    .ToList();

                return Shared.WebApi.Wrap(true, result, HttpStatusCode.OK, null, null);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
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

            return Shared.WebApi.GetTable(connectionString, "account");
        }

        private object Search(string search)
        {
            var query = $@"SELECT * FROM [account] where [name] like '%" + search + "%'";

            return Shared.WebApi.GetTable(connectionString, "account");
        }

        public object CreateOrUpdateChartOfAccountMapping(List<ChartOfAccountMappingDto> obj)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                List<AccountToThirdPartyAccountMapping> accountToThirdPartyAccountMappings =
                    new List<AccountToThirdPartyAccountMapping>();
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();
                foreach (var account in obj)
                {
                    foreach (var mapping in account.ThirdPartyAccountMapping)
                    {
                        if (mapping.MapId == 0)
                        {
                            accountToThirdPartyAccountMappings.Add(
                                CreateThirdPartyAccountMapping(account.AccountId, mapping));
                        }
                        else
                        {
                            UpdateThirdPartyAccountMapping(account.AccountId, mapping, sqlHelper);
                        }
                    }
                }

                if (accountToThirdPartyAccountMappings.Count > 0)
                {
                    new SQLBulkHelper().Insert("account_to_third_party_account_mapping",
                        accountToThirdPartyAccountMappings.ToArray(),
                        sqlHelper.GetConnection(), sqlHelper.GetTransaction(), false, true);
                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                throw ex;
            }
        }

        public AccountToThirdPartyAccountMapping CreateThirdPartyAccountMapping(int accountId,
            ThirdPartyAccount thirdPartyAccount)
        {
            AccountToThirdPartyAccountMapping obj = new AccountToThirdPartyAccountMapping();
            obj.AccountId = accountId;
            obj.CreatedBy = "John Smith";
            obj.CreatedDate = DateTime.UtcNow;
            obj.ThirdPartyAccountId = thirdPartyAccount.ThirdPartyAccountId;
            return obj;
        }

        public void UpdateThirdPartyAccountMapping(int accountId, ThirdPartyAccount thirdPartyAccount,
            SqlHelper sqlHelper)
        {
            List<SqlParameter> mappingParams = new List<SqlParameter>
            {
                new SqlParameter("id", thirdPartyAccount.MapId)
            };
            var query = $@"DELETE FROM [dbo].[account_to_third_party_account_mapping] where [id] = @id";
            sqlHelper.Update(query, CommandType.Text, mappingParams.ToArray());
        }
    }
}