using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Shared.FileMetaData;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountCategoryService : IAccountCategoryService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetAccountCategories(string accountCategoryName)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("accountCategoryName", accountCategoryName)
            };

            var query = $@"SELECT total = COUNT(*) OVER() 
                        ,[id]
                        ,[name]
                        FROM [account_category]";

            query += accountCategoryName.Length > 0
                ? "WHERE [account_category].[name] LIKE '%'+@accountCategoryName+'%'"
                : "";

            List<AccountCategoryOutputDto> accountCategories = new List<AccountCategoryOutputDto>();
            MetaData meta = new MetaData();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, sqlParameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    meta.Total = (int) reader["total"];
                    accountCategories.Add(new AccountCategoryOutputDto
                    {
                        Id = (int) reader["id"],
                        Name = reader["name"].ToString(),
                    });
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Shared.WebApi.Wrap(true, accountCategories,HttpStatusCode.OK,null, meta);
        }
    }
}