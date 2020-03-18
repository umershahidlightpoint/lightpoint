using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Shared.FileMetaData;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountDefService : IAccountDefService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetAccountDefs()
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            var query = $@"SELECT total = COUNT(*) OVER()
                        ,[account_def].[id] AS 'account_def_id'
	                    ,[account_def].[account_category_id]
	                    ,[tag].[id] AS 'tag_id'
	                    ,[tag].[table_name]
	                    ,[tag].[column_name] AS 'tag_name'
                        FROM [account_def] JOIN [account_def_tag] ON [account_def].[id] = [account_def_tag].[account_def_id]
                        JOIN [tag] ON [account_def_tag].[tag_id] = [tag].[id]";

            List<AccountDefOutputDto> accountDefs = new List<AccountDefOutputDto>();
            MetaData meta = new MetaData();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, null, out var sqlConnection))
            {
                while (reader.Read())
                {
                    meta.Total = (int) reader["total"];
                    accountDefs.Add(new AccountDefOutputDto
                    {
                        AccountDefId = (int) reader["account_def_id"],
                        AccountCategoryId = (int) reader["account_category_id"],
                        AccountTags = new List<AccountDefTagOutputDto>
                        {
                            new AccountDefTagOutputDto
                            {
                                TagId = (int) reader["tag_id"], TableName = reader["table_name"].ToString(),
                                TagName = reader["tag_name"].ToString()
                            }
                        }
                    });
                }

                reader.Close();
                sqlConnection.Close();
            }

            var result = accountDefs.GroupBy(account => account.AccountDefId)
                .Select(group => new AccountDefOutputDto
                {
                    AccountDefId = group.Key,
                    AccountCategoryId = group.FirstOrDefault()?.AccountCategoryId,
                    AccountTags = group.SelectMany(tag => tag.AccountTags).ToList()
                })
                .ToList();

            return Shared.WebApi.Wrap(true, result, HttpStatusCode.OK, null, meta);
        }
    }
}