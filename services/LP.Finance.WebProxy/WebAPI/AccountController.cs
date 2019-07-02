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
    public interface IAccountController
    {
        object Data(string symbol);
    }

    public class AccountControllerStub : IAccountController
    {
        public object Data(string symbol)
        {
            return Utils.GetFile("accounts");
        }
    }

    public class AccountControllerService : IAccountController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object Data(string symbol)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                    result = AllData();
                    Utils.Save(result, "accounts");
                    break;
            }

            return result;
        }

        private object AllData()
        {
            var query = $@"SELECT * FROM [account]";

            return Utils.GetTable(connectionString, "account");
        }
    }


    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class AccountController : ApiController
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private IAccountController controller = new AccountControllerService();
        public AccountController()
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