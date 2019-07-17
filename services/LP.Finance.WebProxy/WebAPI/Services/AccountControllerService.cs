using System.Configuration;
using LP.Finance.Common;
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
                case "Accounts":
                    result = GetAccounts();
                    Utils.Save(result, "accounts");
                    break;
            }

            return result;
        }

        public object GetAccounts()
        {
            var query = $@"SELECT [account].[id], [account].[name], [account].[description],
                        [account_category].[name] AS 'category',
                        (SELECT count(*) FROM journal WHERE [journal].[account_id] = [account].[id]) AS 'associated_ledgers'
                        FROM [Finance].[dbo].[account] 
                        JOIN [Finance].[dbo].[account_category] ON [account].[id] = [account_category].[id]";

            return Utils.RunQuery(connectionString, query);
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