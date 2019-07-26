using Newtonsoft.Json;
using System.Configuration;
using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI
{
    public class LedgerService : ILedgerService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object Data(string symbol)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                    result = AllData();
                    Utils.Save(result, "ledgers");
                    break;
            }

            return result;
        }

        private object AllData()
        {
            var query = $@"SELECT * FROM [ledger]";

            return Utils.RunQuery(connectionString, query);
        }
    }
}