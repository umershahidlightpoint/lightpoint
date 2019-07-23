using System.Configuration;
using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class AccountDefControllerService : IAccountDefControllerService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetAccountDefs()
        {
            var query = $@"SELECT [account_def].[id] AS 'account_def_id'
	                    ,[account_def].[account_category_id]
	                    ,[tag].[id] AS 'tag_id'
	                    ,[tag].[table_name]
	                    ,[tag].[column_name] AS 'tag_name'
                        FROM [account_def] JOIN [account_def_tag] ON [account_def].[id] = [account_def_tag].[account_def_id]
                        JOIN [tag] ON [account_def_tag].[tag_id] = [tag].[id]";

            return Utils.RunQuery(connectionString, query);
        }
    }
}