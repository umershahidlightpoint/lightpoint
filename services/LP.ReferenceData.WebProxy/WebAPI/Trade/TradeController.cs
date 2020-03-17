using System;
using System.Web.Http;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using LP.Finance.Common;
using LP.Core;
using LP.Finance.Common.Cache;
using LP.Shared.Core;

namespace LP.ReferenceData.WebProxy.WebAPI.Trade
{
    public interface ITradeController
    {
        object Data(string symbol);
    }

    public class TradeControllerStub : ITradeController
    {
        public object Data(string symbol)
        {
            return LP.Shared.WebApi.GetFile("trades_" + symbol);
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

            LP.Shared.WebApi.Save(result, "trades-" + symbol);

            return result;
        }

        private object AllData(Tuple<DateTime, DateTime> period)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = period.Item1.ToString("MM-dd-yyyy") + " 00:00";
            var enddate = period.Item2.ToString("MM-dd-yyyy") + " 23:59";

            var query = 
$@"select * from FundAccounting..vwCurrentStateTrades
order by TradeDate asc
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