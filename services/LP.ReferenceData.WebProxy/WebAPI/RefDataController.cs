using System.Web.Http;
using Newtonsoft.Json;
using System.Configuration;
using LP.Finance.Common;
using LP.Core;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    interface IRefData
    {
        object Data(string refdata);
    }

    public class RefDataController : ApiController, IRefData
    {
        private readonly IRefData controller = ControllerFactory.Get<IRefData, RefDataMock, RefDataService>();

        [HttpGet]
        [ActionName("data")]
        public object Data(string refdata)
        {
            return controller.Data(refdata);
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
                        funds = Utils.RunQuery(connectionString, "select * from fund where ActiveFlag = 1"),
                        custodians = Utils.GetTable(connectionString, "custodian"),
                        brokers = Utils.GetTable(connectionString, "broker"),
                    };
                    Utils.Save(result, "all");
                    break;
                case "fund":
                    result = Utils.RunQuery(connectionString, "select * from fund where ActiveFlag = 1");
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