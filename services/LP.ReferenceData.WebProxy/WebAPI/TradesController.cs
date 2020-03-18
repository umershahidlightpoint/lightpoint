using System;
using System.Web.Http;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using LP.Finance.Common;
using System.Collections.Generic;
using System.Net;
using LP.Shared;
using LP.Shared.FileMetaData;
using LP.Shared.Controller;

namespace LP.ReferenceData.WebProxy.WebAPI.Trade
{
    internal class TradesCache
    {
        static TradesCache()
        {
            CachedResult = null;
            LastUpdate = DateTime.Now;
        }

        internal static object CachedResult;
        internal static DateTime LastUpdate;
    }

    public interface ITradesController
    {
        object Data(string period, bool journals);

        object Allocations(string orderId);

        object Journals(string orderId = null, DateTime? when = null, string symbol = null);

        object ProspectiveTradesForTaxLotAlleviation(string symbol, string side);
    }

    public class TradesControllerStub : ITradesController
    {
        public object Data(string period, bool journals)
        {
            return LP.Shared.WebApi.GetFile($"trades_{period}_{journals}");
        }

        public object Allocations(string orderId)
        {
            return LP.Shared.WebApi.GetFile("trades_allocations_" + orderId);
        }

        public object Journals(string orderId = null, DateTime? when = null, string symbol = null)
        {
            return LP.Shared.WebApi.GetFile("trades_journals_" + orderId);
        }

        public object ProspectiveTradesForTaxLotAlleviation(string symbol, string side)
        {
            throw new NotImplementedException();
        }
    }

    public class TradesControllerService : ITradesController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["TradeMasterDB"].ToString();

        private readonly string financeConnectionString =
            ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object Allocations(string orderId)
        {
            return OnlyAllocations(orderId);
        }

        public object Journals(string orderId = null, DateTime? when = null, string symbol = null)
        {
            return OnlyJournals(orderId, when, symbol);
        }

        public object Data(string period, bool journals = false)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (period)
            {
                case "ALL":
                case "ITD":
                    result = AllData(System.DateTime.Now.ITD(), journals);
                    break;
                case "YTD":
                    result = AllData(System.DateTime.Now.YTD(), journals);
                    break;
                case "MTD":
                    result = AllData(System.DateTime.Now.MTD(), journals);
                    break;
                case "Today":
                    result = AllData(System.DateTime.Now.Today(), journals);
                    break;
                default:
                    result = Only(period);
                    break;
            }

            LP.Shared.WebApi.Save(result, $"trades_{period}_{journals}");

            return result;
        }

        private object AllData(Tuple<DateTime, DateTime> period, bool journals = false)
        {
            var content = "{}";

            var startdate = period.Item1.ToString("MM-dd-yyyy") + " 00:00";
            var enddate = period.Item2.ToString("MM-dd-yyyy") + " 23:59";

            var query = "";
            if (journals)
            {
                query = $@"select * from FundAccounting..vwCurrentStateTrades
                        where SecurityType in ('Journals')
                        order by TradeDate desc";
            }
            else
            {
                // this gives me the raw trades, but need to inlcude the manual trades as well.
                query = $@"select s.*, e.exclude from FundAccounting..vwCurrentStateTrades s
                        left join FundAccounting..trade_exclusion e on s.lporderid = e.lporderid and e.exclude = 'Y'
                        where SecurityType not in ('Journals')
                        union 
                        select s.*, e.exclude from FundAccounting..current_trade_state s
                        left join FundAccounting..trade_exclusion e on s.lporderid = e.lporderid and e.exclude = 'Y'
                        where TradeType in ('manual')
                        order by TradeDate desc";
            }

            MetaData metaData = null;

            using (var con = new SqlConnection(connectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();
                con.Open();
                sda.Fill(dataTable);
                con.Close();

                metaData = MetaData.ToMetaData(dataTable);

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;
            }

            dynamic json = JsonConvert.DeserializeObject(content);

            return LP.Shared.WebApi.GridWrap(json, metaData);
        }

        private object Only(string orderId)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query = $@"select * from Trade nolock
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

        private object OnlyAllocations(string orderId)
        {
            var content = "{}";

            var query = $@"select * from Allocation with(nolock)
                        where LpOrderId='{orderId}'
                        or ParentOrderId='{orderId}'
                        order by UpdatedOn desc";

            MetaData metaData = null;

            using (var con = new SqlConnection(connectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();
                con.Open();
                sda.Fill(dataTable);
                con.Close();

                metaData = MetaData.ToMetaData(dataTable);

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;
            }


            dynamic json = JsonConvert.DeserializeObject(content);

            return LP.Shared.WebApi.GridWrap(json, metaData);
        }

        private object OnlyJournals(string orderId = null, DateTime? when = null, string symbol = null)
        {
            var content = "{}";

            var query = $@"select 
                        d.[id],
                        d.debit,
                        d.credit, 
                        abs(d.debit) - abs(d.credit) as balance,
                        d.[account_id],
                        d.AccountCategory,
                        d.AccountType,
                        d.AccountName,
                        d.AccountDescription,
                        d.[fund],
                        d.[value],
                        d.[source],
                        d.[when],
                        d.[event],
                        d.[start_price],
                        d.[end_price]
                        from(
                            select * from vwJournal";

            query += !string.IsNullOrEmpty(orderId) ? $" where source = '{orderId}'" : "";

            query += string.IsNullOrEmpty(orderId) && when.HasValue && !string.IsNullOrEmpty(symbol)
                ? $" where [when] = '{when}' AND symbol = '{symbol}'"
                : "";

            query += " ) as d";

            MetaData metaData = null;

            using (var con = new SqlConnection(financeConnectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();
                con.Open();
                sda.Fill(dataTable);
                con.Close();

                metaData = MetaData.ToMetaData(dataTable);

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;
            }


            dynamic json = JsonConvert.DeserializeObject(content);

            return WebApi.GridWrap(json, metaData);
        }

        public object ProspectiveTradesForTaxLotAlleviation(string symbol, string side)
        {
            string correspondingSide = "";
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            switch (side)
            {
                case "BUY":
                    correspondingSide = "SELL";
                    break;
                case "SHORT":
                    correspondingSide = "COVER";
                    break;
                default:
                    break;
            }

            List<SqlParameter> sqlParams = new List<SqlParameter>()
            {
                new SqlParameter("side", correspondingSide),
                new SqlParameter("symbol", symbol)
            };

            var query = $@"select * from Trade nolock
                        where side= @side
                        and symbol = @symbol
                        order by UpdatedOn desc";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
            var serialized = JsonConvert.SerializeObject(dataTable);
            var resp = JsonConvert.DeserializeObject(serialized);

            return LP.Shared.WebApi.Wrap(true, resp, HttpStatusCode.OK);
        }
    }

    /// <summary>
    /// Deliver the Tiles / Links Resources to the Logged in User
    /// </summary>
    [RoutePrefix("api/trades")]
    public class TradesController : ApiController, ITradesController
    {
        // Mock Service
        private readonly ITradesController controller =
            ControllerFactory.Get<ITradesController, TradesControllerStub, TradesControllerService>();

        public TradesController()
        {
        }

        [HttpGet]
        public object Data(string period, bool journal = false)
        {
            return controller.Data(period, journal);
        }

        [HttpGet]
        [Route("allocations")]
        public object Allocations(string orderId)
        {
            return controller.Allocations(orderId);
        }

        [HttpGet]
        [Route("journals")]
        public object Journals(string orderId = null, DateTime? when = null, string symbol = null)
        {
            return controller.Journals(orderId, when, symbol);
        }

        [HttpGet]
        [Route("prospectiveTradesToAlleviateTaxLot")]
        public object ProspectiveTradesForTaxLotAlleviation(string symbol, string side)
        {
            return controller.ProspectiveTradesForTaxLotAlleviation(symbol, side);
        }
    }
}