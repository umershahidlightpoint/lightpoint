using System.Web.Http;
using Newtonsoft.Json;
using System.Configuration;
using LP.Finance.Common;
using LP.Finance.Common.Cache;
using LP.Shared.Core;
using LP.Shared;

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
            var cachedData = AppStartCache.GetCachedData(refdata);
            if (cachedData.Item1)
            {
                return cachedData.Item2;
            }
            else
            {
                return controller.Data(refdata);
            }
        }
    }

    public class RefDataMock : IRefData
    {
        public object Data(string refdata)
        {
            return LP.Shared.WebApi.GetFile(refdata);
        }
    }

    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class RefDataService : IRefData
    {
        private readonly string connectionString;
        private readonly string connectionStringTradeMaster;

        public RefDataService()
        {
            connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDb"].ToString();
            connectionStringTradeMaster = ConfigurationManager.ConnectionStrings["TradeMasterDB"].ToString();
        }

        public object Data(string refdata)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (refdata.ToLower())
            {
                case "all":
                    result = new
                    {
                        funds = LP.Shared.WebApi.RunQuery(connectionString, "select * from fund where ActiveFlag = 1"),
                        custodians = LP.Shared.WebApi.GetTable(connectionString, "custodian"),
                        brokers = LP.Shared.WebApi.GetTable(connectionString, "broker"),
                    };
                    LP.Shared.WebApi.Save(result, "all");
                    break;
                case "fund":
                    result = LP.Shared.WebApi.RunQuery(connectionString, "select * from fund where ActiveFlag = 1");
                    LP.Shared.WebApi.Save(result, "fund");
                    break;
                case "custodian":
                    result = LP.Shared.WebApi.GetTable(connectionString, "custodian");
                    LP.Shared.WebApi.Save(result, "custodian");
                    break;
                case "portfolio":
                    result = LP.Shared.WebApi.GetTable(connectionString, "portfolio");
                    LP.Shared.WebApi.Save(result, "portfolio");
                    break;
                case "broker":
                    result = LP.Shared.WebApi.GetTable(connectionString, "broker");
                    LP.Shared.WebApi.Save(result, "broker");
                    break;
                case "symbol":
                    result = LP.Shared.WebApi.RunQuery(connectionStringTradeMaster, "select distinct symbol from trade");
                    LP.Shared.WebApi.Save(result, "symbol");
                    break;
            }

            return result;
        }
    }
}