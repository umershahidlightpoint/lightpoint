using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountControllerService : IAccountControllerService
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
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("pageNumber", pageNumber), new SqlParameter("pageSize", pageSize),
                new SqlParameter("accountName", accountName), new SqlParameter("accountCategory", accountCategory)
            };

            var query = $@"SELECT total = COUNT(*) OVER()
                        ,[account].[id]
                        ,[account].[name]
	                    ,[account].[description]
                        ,[account_category].[id] AS 'category_id'
	                    ,[account_category].[name] AS 'category' 
	                    ,CASE WHEN EXISTS (SELECT [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'Yes' 
	                    ELSE 'No'
	                    END AS 'has_journal'
                        FROM [account] JOIN [account_category] ON [account].[account_category_id] = [account_category].[id]";

            query += accountName.Length > 0 ? " WHERE [account].[name] LIKE '%'+@accountName+'%'" : "";

            query += accountName.Length > 0
                ? (accountCategory.Length > 0 ? " AND [account_category].[name] LIKE '%'+@accountCategory+'%'" : "")
                : (accountCategory.Length > 0 ? " WHERE [account_category].[name] LIKE '%'+@accountCategory+'%'" : "");

            query +=
                " ORDER BY [account].[id] DESC OFFSET(@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY";

            return Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
        }

        // Still Work is in Progress
        public object CreateAccount(AccountDto account)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

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
            int accountId = 0;
            sqlHelper.Insert(accountQuery, CommandType.Text, accountParameters.ToArray(), out accountId);

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

            return Utils.Wrap(true);
        }

        public object UpdateAccount(int id, Account account)
        {
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id), new SqlParameter("description", account.Description)
            };

            var query = $@"UPDATE [account]
                        SET [description] = @description
                        WHERE [id] = @id";

            return Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
        }

        public object DeleteAccount(int id)
        {
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id)
            };

            if (AccountHasJournal(id))
            {
                return Utils.Wrap(false, "An Account having Journal cannot be Deleted");
            }

            var query = $@"DELETE FROM [dbo].[account]
                        WHERE [id] = @id";

            return Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
        }

        private bool AccountHasJournal(int id)
        {
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id)
            };

            var query = $@"SELECT 
                        CASE WHEN EXISTS 
                        (SELECT [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'true'
                        ELSE 'false'
	                    END AS 'has_journal'
                        FROM [account] JOIN [account_category] ON [account].[account_category_id] = [account_category].[id]
	                    WHERE [account].[id] = @id";

            var result = Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
            dynamic hasJournal = result?.GetType().GetProperty("payload")?.GetValue(result, null);


            return hasJournal == null || (bool) hasJournal[0].has_journal;
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