using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountTypeService : IAccountTypeService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetAccountTypes(int? accountCategoryId)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("accountCategoryId", accountCategoryId)
            };

            var parameters = accountCategoryId != null ? sqlParameters.ToArray() : null;

            var query = $@"SELECT total = COUNT(*) OVER() 
                        ,[id]
                        ,[name]
                        FROM [account_type]";

            query += accountCategoryId != null
                ? "WHERE [account_type].[account_category_id] = @accountCategoryId"
                : "";

            List<AccountTypeOutputDto> accountTypes = new List<AccountTypeOutputDto>();
            MetaData meta = new MetaData();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, parameters, out var sqlConnection))
            {
                while (reader.Read())
                {
                    meta.Total = (int) reader["total"];
                    accountTypes.Add(new AccountTypeOutputDto
                    {
                        Id = (int) reader["id"],
                        Name = reader["name"].ToString(),
                    });
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Utils.Wrap(true, accountTypes, HttpStatusCode.OK, null, meta);
        }
    }
}