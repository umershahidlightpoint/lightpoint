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
using System.Collections.Generic;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI
{
    public interface IJournalLogController
    {
        object Data(string symbol, int pageNumber, int pageSize, string sortColum = "id", string sortDirection = "asc", int accountId = 0, int value=0);
    }

    public class JournalLogControllerStub : IJournalLogController
    {
        public object Data(string symbol, int pageNumber, int pageSize, string sortColum = "id", string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            return Utils.GetFile("journallogs");
        }
    }

    public class JournalLogControllerService : IJournalLogController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        public SqlHelper sqlHelper = new SqlHelper(ConfigurationManager.ConnectionStrings["FinanceDB"].ToString());
        public object Data(string symbol,int pageNumber,int pageSize, string sortColum = "id", string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                    result = AllData(pageNumber, pageSize, sortColum, sortDirection ,accountId, value);
                    Utils.Save(result, "journallogs");
                    break;
                

                default:
                    result = Only(symbol);
                    break;
            }

            return result;
        }

        private object AllData(int pageNumber,int pageSize, string sortColum = "id", string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            var query = $@"select * from journal_log";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
             
            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Utils.GridWrap(json);
        }

      
        private object Only(string orderId)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query = $@"select LpOrderId, Action, Symbol, Side, Quantity, SecurityType, CustodianCode, ExecutionBroker, TradeId, Fund, PMCode, PortfolioCode, TradePrice, TradeDate, Trader, Status, Commission, Fees, NetMoney, UpdatedOn from Trade nolock
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
    public class JournalLogController : ApiController, IJournalLogController
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private IJournalLogController controller = new JournalLogControllerService();
        public JournalLogController()
        {
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string refdata, int pageNumber,int pageSize,string sortColum ="id",string sortDirection= "asc", int accountId =0 ,int value=0)
        {
            return controller.Data(refdata, pageNumber, pageSize, sortColum, sortDirection,accountId, value);
        }

    }
}