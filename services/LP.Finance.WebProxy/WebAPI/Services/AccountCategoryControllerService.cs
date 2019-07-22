using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountCategoryControllerService : IAccountCategoryControllerService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetAccountCategories(string accountCategoryName)
        {
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("accountCategoryName", accountCategoryName)
            };

            var query = $@"SELECT 
                        [id]
                        ,[name]
                        FROM [account_category]";

            query += accountCategoryName.Length > 0
                ? "WHERE [account_category].[name] LIKE '%'+@accountCategoryName+'%'"
                : "";

            return Utils.RunQuery(connectionString, query, sqlParameters.ToArray());
        }
    }
}