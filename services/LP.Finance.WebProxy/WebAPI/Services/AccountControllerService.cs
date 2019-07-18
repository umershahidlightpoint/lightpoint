using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using LP.Finance.Common;
using Newtonsoft.Json;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountControllerService : IAccountControllerService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object Data(string symbol, int pageNumber, int pageSize, string accountName, string accountCategory,
            string search = "")
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
                case "Accounts":
                    result = GetAccounts(pageNumber, pageSize, accountName, accountCategory);
                    Utils.Save(result, "accounts");
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
	                    ,CASE WHEN EXISTS (SELECT [journal].[id] FROM [journal] WHERE [journal].[account_id] = [account].[id])
	                    THEN 'Yes' 
	                    ELSE 'No'
	                    END AS 'has_journal'
                        FROM [account] JOIN [account_category] ON [account].[account_category_id] = [account_category].[id]";

            query += accountName.Length > 0 ? " WHERE [account].[name] LIKE '%'+@accountName+'%'" : "";

            query += accountName.Length > 0
                ? (accountCategory.Length > 0 ? " AND [account_category].[name] LIKE '%'+@accountCategory+'%'" : "")
                : (accountCategory.Length > 0 ? " WHERE [account_category].[name] LIKE '%'+@accountCategory+'%'" : "");

            query += " ORDER BY [account].[id] OFFSET(@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY";

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