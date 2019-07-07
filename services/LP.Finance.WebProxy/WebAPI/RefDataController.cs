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
    interface IRefData
    {
        object Data(string refdata);
    }

    public class RefDataController : ApiController, IRefData
    {
        IRefData proxy = new RefDataMock();

        [HttpGet]
        [ActionName("data")]
        public object Data(string refdata)
        {
            return proxy.Data(refdata);
        }
    }

    public class RefDataMock : IRefData
    {
        public object Data(string refdata)
        {
            return Utils.GetFile(refdata);
        }
    }

    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class RefDataService : IRefData
    {
        private readonly string connectionString;

        public RefDataService()
        {
            connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDb"].ToString();
        }

        public object Data(string refdata)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (refdata.ToLower())
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