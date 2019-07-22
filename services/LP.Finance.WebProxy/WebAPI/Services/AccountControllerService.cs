using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using LP.Finance.Common;
using LP.Finance.Common.Models;
using Newtonsoft.Json;

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
	                    ,[account_category].[name] AS 'category'
                        ,[account_category].[id] AS 'category_id'
	                    ,CASE WHEN EXISTS (SELECT [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'Yes' 
	                    ELSE 'No'
	                    END AS 'has_journal'
                        FROM [account] JOIN [account_category] ON [account].[account_category_id] = [account_category].[id]";

            query += accountName.Length > 0 ? " WHERE [account].[name] LIKE '%'+@accountName+'%'" : "";

            query += accountName.Length > 0
                ? (accountCategory.Length > 0 ? " AND [account_category].[name] LIKE '%'+@accountCategory+'%'" : "")
                : (accountCategory.Length > 0 ? " WHERE [account_category].[name] LIKE '%'+@accountCategory+'%'" : "");

            query += " ORDER BY [account].[id] DESC OFFSET(@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY";

            return Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
        }

        public object CreateAccount(Account account)
        {
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("name", account.Name), new SqlParameter("description", account.Description),
                new SqlParameter("category", account.Category)
            };

            var query = $@"INSERT INTO [account]
                        ([name]
                        ,[description]
                        ,[account_category_id])
                        VALUES
                        (@name
                        ,@description
                        ,@category)";

            return Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
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

            var query = $@"DELETE FROM [dbo].[account]
                        WHERE [id] = @id";

            return Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
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