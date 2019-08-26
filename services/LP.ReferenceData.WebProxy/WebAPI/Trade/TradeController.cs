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
using LP.Core;
using CommonAPI;
using System.Collections.Generic;

namespace LP.ReferenceData.WebProxy.WebAPI.Trade
{
    internal class DataCacheElement
    {
        internal DateTime LastUpdate { get; set; }
        internal string Key { get; set; }
        internal object CachedModel { get; set; }
    }

    internal class DataCache
    {
        private static object lockHandle = "DataCache_lock";
        static DataCache()
        {
            CachedResults = new Dictionary<string, DataCacheElement>();
        }

        private static Dictionary<string, DataCacheElement> CachedResults { get; set; }

        /// <summary>
        /// ONly caches the data for 5 mins
        /// </summary>
        /// <param name="key"></param>
        /// <param name="p"></param>
        /// <returns></returns>
        public static object Results(string key, Func<object> p)
        {
            lock (lockHandle)
            {
                if (!CachedResults.ContainsKey(key))
                {
                    CachedResults.Add(key, new DataCacheElement
                    {
                        CachedModel = p(),
                        LastUpdate = DateTime.Now,
                        Key = key
                    }); ;
                }
                else
                {
                    var element = CachedResults[key];
                    if (DateTime.Now > element.LastUpdate.AddMinutes(5))
                    {
                        element.CachedModel = p();
                        element.LastUpdate = DateTime.Now;
                    }
                }

                return CachedResults[key].CachedModel;
            }

        }
    }

    public interface ITradeController
    {
        object Data(string symbol);
    }

    public class TradeControllerStub : ITradeController
    {
        public object Data(string symbol)
        {
            return Utils.GetFile("trades-" + symbol);
        }
    }

    public class TradeControllerService : ITradeController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["TradeMasterDB"].ToString();

        public object Data(string symbol)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                case "ITD":
                    result = AllData(System.DateTime.Now.ITD());
                    break;
                case "YTD":
                    result = AllData(System.DateTime.Now.YTD());
                    break;
                case "MTD":
                    result = AllData(System.DateTime.Now.MTD());
                    break;
                case "Today":
                    result = AllData(System.DateTime.Now.Today());
                    break;
                default:
                    result = Only(symbol);
                    break;
            }

            Utils.Save(result, "trades-" + symbol);

            return result;
        }

        private object AllData(Tuple<DateTime, DateTime> period)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = period.Item1.ToString("MM-dd-yyyy") + " 00:00";
            var enddate = period.Item2.ToString("MM-dd-yyyy") + " 16:30";

            var query = 
$@"select 
    ParentOrderId,
	LpOrderId, Action, Symbol, Side, Quantity, TimeInForce, OrderType, SecurityType,  BloombergCode,
	CustodianCode, ExecutionBroker, TradeId, Fund, 
	PMCode, PortfolioCode, Trader, 
	TradeCurrency, TradePrice, TradeDate, 
	SettleCurrency, SettlePrice, SettleDate, 
	TradeType,
	Status, 
	NetMoney,Commission, Fees, 
	SettleNetMoney, NetPrice, SettleNetPrice,
	OrderedQuantity, FilledQuantity,RemainingQuantity,
	OrderSource,
	UpdatedOn, 
	COALESCE(LocalNetNotional,0) as LocalNetNotional  from Trade with(nolock)
where LastUpdateTime between CONVERT(datetime, '{startdate}') and CONVERT(datetime, '{enddate}') 
order by UpdatedOn desc
";

            using (var con = new SqlConnection(connectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();
                con.Open();
                sda.Fill(dataTable);
                con.Close();

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;

                Console.WriteLine("Done");
            }


            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }

        private object Only(string orderId)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query = $@"select 
            * from Trade nolock
                where LPOrderId='{orderId}'
                order by UpdatedOn desc";

            using (var con = new SqlConnection(connectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();
                con.Open();
                sda.Fill(dataTable);
                con.Close();

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;

                Console.WriteLine("Done");
            }


            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }
    }


    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class TradeController : ApiController, ITradeController
    {
        // Mock Service
        private readonly ITradeController controller = ControllerFactory.Get<ITradeController, TradeControllerStub, TradeControllerService>();

        public TradeController()
        {
        }

        [HttpGet]
        public object Data(string period)
        {
            var key = $"trade-{period}";

            return DataCache.Results(key, () => { return controller.Data(period); });
        }

    }
}