using System.Configuration;
using Newtonsoft.Json;

namespace LP.Finance.WebProxy.WebAPI.Services
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
                    Shared.WebApi.Save(result, "ledgers");
                    break;
            }

            return result;
        }

        private object AllData()
        {
            var query = $@"SELECT * FROM [ledger]";

            return Shared.WebApi.RunQuery(connectionString, query);
        }
    }
}