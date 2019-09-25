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
        object Data(string period);

        object Allocations(string accrualId);
    }

    public class TradesControllerStub : ITradesController
    {
        public object Data(string period)
        {
            return Utils.GetFile("trades_" + period);
        }

        public object Allocations(string orderId)
        {
            return Utils.GetFile("trades_allocations_" + orderId);
        }

    }

    public class TradesControllerService : ITradesController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["TradeMasterDB"].ToString();

        public object Allocations(string accrualId)
        {
            return OnlyAllocations(accrualId);
        }

        public object Data(string period)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (period)
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
                    result = Only(period);
                    break;
            }

            Utils.Save(result, "trades" + period);

            return result;
        }

        private object AllData(Tuple<DateTime, DateTime> period)
        {
            var content = "{}";

            var startdate = period.Item1.ToString("MM-dd-yyyy") + " 00:00";
            var enddate = period.Item2.ToString("MM-dd-yyyy") + " 16:30";

            var query = 
$@"select * from trade with(nolock)
where UpdatedOn between CONVERT(datetime, '{startdate}') and CONVERT(datetime, '{enddate}') 
-- and SecurityType not in ('Journals')
-- and accrualId in ( select distinct accrualId from allocation with(nolock))
order by UpdatedOn desc
";
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

            return Utils.GridWrap(json, metaData);
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

        private object OnlyAllocations(string orderId)
        {
            var content = "{}";

            var query = $@"select 
            * from Allocation with(nolock)
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

            return Utils.GridWrap(json, metaData);
        }

    }


    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    [RoutePrefix("api/trades")]
    public class TradesController : ApiController, ITradesController
    {
        // Mock Service
        private readonly ITradesController controller = ControllerFactory.Get<ITradesController, TradesControllerStub, TradesControllerService>();

        public TradesController()
        {
        }

        [HttpGet]
        public object Data(string period)
        {
            return controller.Data(period);
        }

        [HttpGet]
        [Route("allocations/{orderId}")]
        public object Allocations(string orderId)
        {
            return controller.Allocations(orderId);
        }

    }
}