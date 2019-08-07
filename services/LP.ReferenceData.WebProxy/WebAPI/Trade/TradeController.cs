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

namespace LP.ReferenceData.WebProxy.WebAPI.Trade
{
    internal class TradeCache
    {
        static TradeCache()
        {
            CachedResult = null;
            LastUpdate = DateTime.Now;
        }

        internal static object CachedResult;
        internal static DateTime LastUpdate;
    }

    public interface ITradeController
    {
        object Data(string symbol);
    }

    public class TradeControllerStub : ITradeController
    {
        public object Data(string symbol)
        {
            return Utils.GetFile("trades");
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
                    result = AllData();
                    break;
                default:
                    result = Only(symbol);
                    break;
            }

            Utils.Save(result, "trades");

            return result;
        }

        private object AllData()
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query = $@"select 
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
	COALESCE(LocalNetNotional,0) as LocalNetNotional  from Trade nolock
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

            var query = $@"select LpOrderId, Action, Symbol, Side, Quantity, SecurityType, CustodianCode, ExecutionBroker, TradeId, Fund, PMCode, PortfolioCode, TradePrice, TradeDate, Trader, Status, Commission, Fees, NetMoney, LocalNetNotional, UpdatedOn from Trade nolock
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
        private readonly ITradeController controller;

        public TradeController()
        {
            controller = ControllerFactory.Get<ITradeController, TradeControllerStub, TradeControllerService>();
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol)
        {
            if (TradeCache.CachedResult == null || DateTime.Now > TradeCache.LastUpdate.AddMinutes(5))
            {
                TradeCache.CachedResult = controller.Data(symbol);
                TradeCache.LastUpdate = DateTime.Now;
            }

            return TradeCache.CachedResult;
        }

    }
}