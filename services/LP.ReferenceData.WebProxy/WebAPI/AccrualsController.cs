/*
Accruals are captured in Accruals table in Trade Master. The trade that originates the accrual is in Trade table. Both are linked together using foreign keys (Accrual ID, LP Order ID). 

Accruals are displayed under Accruals tab in OpsBlotter. For each accrual we display Current, Historical activities and Accrual Schedule. 
Current activities display the PNL and CASH adjustments made for that day. Historical display all the PNL and CASH adjustments(including today) done for that accrual. 
Accrual Schedule (not stored in DWH) display how the schedule would look like on each day along with what was done for that day (Expected Vs Actual)

We are currently working on automating the daily adjustments. Otherwise currently it is manual process. User has to right click on a accrual row in the accrual schedule and add Transaction on a daily basis. This would be automated. 

Also recently we build the cash payment generation. This can be performed by right click on an accrual row in Accrual Schedule tab and click cash transaction. 

All the PNL and CASH adjustments flow into BookMon. It also updates the accrual row in OpsBlotter and also in DB (accrual table).

Most of the accrual logic built into OpsBlotter UI and the transaction addition logic is in OMS service. 

*/
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

namespace LP.ReferenceData.WebProxy.WebAPI.Trade
{
    internal class AccrualsCache
    {
        static AccrualsCache()
        {
            CachedResult = null;
            LastUpdate = DateTime.Now;
        }

        internal static object CachedResult;
        internal static DateTime LastUpdate;
    }

    public interface IAccrualsController
    {
        object Data(string symbol);
    }

    public class AccrualsControllerStub : IAccrualsController
    {
        public object Data(string symbol)
        {
            return Utils.GetFile("accruals_" + symbol);
        }
    }

    public class AccrualsControllerService : IAccrualsController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["TradeMasterDB"].ToString();

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

            Utils.Save(result, "accruals_" + period);

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
$@"select * from Accrual with(nolock)
where UpdatedOn between CONVERT(datetime, '{startdate}') and CONVERT(datetime, '{enddate}') 
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
    public class AccrualsController : ApiController, IAccrualsController
    {
        // Mock Service
        private readonly IAccrualsController controller = ControllerFactory.Get<IAccrualsController, AccrualsControllerStub, AccrualsControllerService>();

        public AccrualsController()
        {
        }

        [HttpGet]
        public object Data(string period)
        {
            return controller.Data(period);
        }

    }
}