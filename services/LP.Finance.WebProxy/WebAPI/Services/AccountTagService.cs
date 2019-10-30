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
    class AccountTagService : IAccountTagService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetAccountTags(string accountTagName)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("accountTagName", accountTagName)
            };

            var query = $@"SELECT total = COUNT(*) OVER()
                        ,[id]
                        ,[column_name] AS 'name'
                        FROM [tag]";

            query += accountTagName.Length > 0
                ? "WHERE [tag].[column_name] LIKE '%'+@accountTagName+'%'"
                : "";

            List<TagOutputDto> tags = new List<TagOutputDto>();
            MetaData meta = new MetaData();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, sqlParameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    meta.Total = (int) reader["total"];
                    tags.Add(new TagOutputDto
                    {
                        Id = (int) reader["id"],
                        Name = reader["name"].ToString(),
                    });
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Utils.Wrap(true, tags, HttpStatusCode.OK, null, meta);
        }
    }
}