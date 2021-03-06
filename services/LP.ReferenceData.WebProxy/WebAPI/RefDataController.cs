﻿using System.Web.Http;
using Newtonsoft.Json;
using System.Configuration;
using LP.Finance.Common;
using LP.Core;
using LP.Finance.Common.Cache;

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
            return Utils.GetFile(refdata);
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
                case "portfolio":
                    result = Utils.GetTable(connectionString, "portfolio");
                    Utils.Save(result, "portfolio");
                    break;
                case "broker":
                    result = Utils.GetTable(connectionString, "broker");
                    Utils.Save(result, "broker");
                    break;
                case "symbol":
                    result = Utils.RunQuery(connectionStringTradeMaster, "select distinct symbol from trade");
                    Utils.Save(result, "symbol");
                    break;
            }

            return result;
        }
    }
}