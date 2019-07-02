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
    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class RefDataController : ApiController
    {
        private const string portfolioCode = "Portfolio A";
        private readonly string connectionString;

        public RefDataController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDb"].ToString();
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol.ToLower())
            {
                case "all":
                    result = new
                    {
                        funds = Utils.GetTable(connectionString, "fund"),
                        custodians = Utils.GetTable(connectionString, "custodian"),
                        brokers = Utils.GetTable(connectionString, "broker"),
                    };
                    Utils.Save(result, "all");
                    break;
                case "fund":
                    result = Utils.GetTable(connectionString, "fund");
                    Utils.Save(result, "fund");
                    break;
                case "custodian":
                    result = Utils.GetTable(connectionString, "custodian");
                    Utils.Save(result, "custodian");
                    break;
                case "broker":
                    result = Utils.GetTable(connectionString, "broker");
                    Utils.Save(result, "broker");
                    break;
            }

            return result;
        }
    }
}