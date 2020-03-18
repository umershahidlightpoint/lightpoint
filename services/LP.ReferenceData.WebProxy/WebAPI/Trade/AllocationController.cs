using System;
using System.Web.Http;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using LP.Finance.Common;
using System.Diagnostics;
using LP.Shared.Controller;
using LP.Shared.Cache;

namespace LP.ReferenceData.WebProxy.WebAPI.Trade
{
    public interface IAllocationController
    {
        object Data(string symbol);
    }

    public class AllocationControllerStub : IAllocationController
    {
        public object Data(string symbol)
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();

            var result = LP.Shared.WebApi.GetString($"allocations_{symbol}");
            
            return new
            {
                elapsedTime = stopWatch.ElapsedMilliseconds,
                payload = result
            };
        }
    }

    public class AllocationControllerService : IAllocationController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["TradeMasterDB"].ToString();

        public object Data(string symbol)
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();

            dynamic result = "{}";

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

            var returnValue = new
            {
                elapsedTime = stopWatch.ElapsedMilliseconds,
                payload = result
            };

            LP.Shared.WebApi.SaveString(result, $"allocations-{symbol}");

            return returnValue;
        }

        private object AllData(Tuple<DateTime, DateTime> period)
        {
            var content = "{}";

            var startdate = period.Item1.ToString("MM-dd-yyyy") + " 00:00";
            var enddate = period.Item2.ToString("MM-dd-yyyy") + " 23:59";

            var query =
                $@"select 
    ParentOrderId, 
    ParentSymbol, LpOrderId, AccrualId, Action, coalesce(s.SecurityCode, Symbol) as Symbol, 
    Side, Quantity, TimeInForce, OrderType, SecurityType,  BloombergCode,
	CustodianCode, ExecutionBroker, TradeId, Fund, 
    allocation.SecurityId,
	PMCode, PortfolioCode, Trader, 
	TradeCurrency, TradePrice, TradeDate, 
	SettleCurrency, SettlePrice, SettleDate, 
	TradeType,
	Status, 
	NetMoney,Commission, Fees, 
	SettleNetMoney, NetPrice, SettleNetPrice,
	-- OrderedQuantity, FilledQuantity,RemainingQuantity,
	OrderSource,
	UpdatedOn, 
	COALESCE(LocalNetNotional,0) as LocalNetNotional  from allocation with(nolock)
	left outer join SecurityMaster..Security s on s.SecurityId = allocation.SecurityId
where allocation.LastUpdateTime between CONVERT(datetime, '{startdate}') and CONVERT(datetime, '{enddate}') 
order by allocation.UpdatedOn desc
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
            }

            return content;
        }

        private object Only(string orderId)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query =
                $@"select LpOrderId, Action, Symbol, Side, Quantity, SecurityType, CustodianCode, ExecutionBroker, TradeId, Fund, PMCode, PortfolioCode, TradePrice, TradeDate, Trader, Status, Commission, Fees, NetMoney, UpdatedOn from Allocation nolock
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
    public class AllocationController : ApiController, IAllocationController
    {
        private readonly IAllocationController controller = ControllerFactory
            .Get<IAllocationController, AllocationControllerStub, AllocationControllerService>();

        public AllocationController()
        {
        }

        [HttpGet]
        public object Data(string period)
        {
            var key = $"allocation-{period}";

            return DataCache.Results(key, () => { return controller.Data(period); });
        }
    }
}