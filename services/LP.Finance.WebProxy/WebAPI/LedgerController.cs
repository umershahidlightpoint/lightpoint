using System.Collections;
using System.Linq;
using System;
using System.Web.Http;
using System.IO;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Security.Principal;
using System.Threading;
using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI
{
    public interface ILedgerController
    {
        object Data(string symbol);
    }

    public class LedgerControllerStub : ILedgerController
    {
        public object Data(string symbol)
        {
            return Utils.GetFile("ledgers");
        }
    }

    public class LedgerControllerService : ILedgerController
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


    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class LedgerController : ApiController
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private ILedgerController controller = new LedgerControllerService();
        public LedgerController()
        {
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol)
        {
            return controller.Data(symbol);
        }

    }
}