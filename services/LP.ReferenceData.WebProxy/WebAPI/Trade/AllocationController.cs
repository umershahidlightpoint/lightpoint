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
    public class AllocationControllerStub : ITradeController
    {
        public object Data(string symbol)
        {
            return Utils.GetFile("allocations");
        }
    }

    public class AllocationControllerService : ITradeController
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

            Utils.Save(result, "allocations");

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

            var query = $@"select LpOrderId, Action, Symbol, Side, Quantity, SecurityType, CustodianCode, ExecutionBroker, TradeId, Fund, PMCode, PortfolioCode, TradePrice, TradeDate, SettleDate, Trader, Status, Commission, Fees, NetMoney, UpdatedOn, COALESCE(LocalNetNotional,0) as LocalNetNotional from Allocation nolock
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

        private object Only(string orderId)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query = $@"select LpOrderId, Action, Symbol, Side, Quantity, SecurityType, CustodianCode, ExecutionBroker, TradeId, Fund, PMCode, PortfolioCode, TradePrice, TradeDate, Trader, Status, Commission, Fees, NetMoney, UpdatedOn from Allocation nolock
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
    public class AllocationController : ApiController, ITradeController
    {
        private readonly ITradeController controller;

        public AllocationController()
        {
            controller = ControllerFactory.Get<ITradeController, AllocationControllerStub, AllocationControllerService>();
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol)
        {
            return controller.Data(symbol);
        }

    }

    /// <summary>
    /// Determines if we are to use the Mock or the Service
    /// </summary>
    public class ControllerFactory
    {
        private static readonly string MOCK = ConfigurationManager.AppSettings["Mock"];

        public static I Get<I, M, S>()
            where M : I, new()
            where S : I, new()
        {
            if (string.IsNullOrEmpty(MOCK))
            {
                return new S();
            }

            return new M();
        }
    }
}