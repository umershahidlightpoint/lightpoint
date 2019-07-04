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
    public interface IJournalController
    {
        object Data(string symbol, int pageNumber, int pageSize, string sortColum = "id", string sortDirection = "asc", int accountId = 0, int value=0);
    }

    public class JournalControllerStub : IJournalController
    {
        public object Data(string symbol, int pageNumber, int pageSize, string sortColum = "id", string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            return Utils.GetFile("journals");
        }
    }

    public class JournalControllerService : IJournalController
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
                    Utils.Save(result, "journals");
                    break;
                

                default:
                    result = Only(symbol);
                    break;
            }

            return result;
        }

        private object AllData(int pageNumber,int pageSize, string sortColum = "id", string sortDirection = "asc", int accountId = 0, int value = 0)
        {

            metaData metaData = new metaData();
            bool whereAdded = false;
            var query = $@"SELECT overall_count = COUNT(*) OVER() , [journal].[id]  ,[account_id],[account_category].[name] as AccountType,  [account].[name] as accountName  ,[value]  ,[source] ,[when] FROM [journal]  join account  on [journal]. [account_id] = account.id join [account_category] on  [account].account_category_id = [account_category] .id ";

            List<SqlParameter> sqlParams = new List<SqlParameter>() ;
            sqlParams.Add ( new SqlParameter("pageNumber", pageNumber));
            sqlParams.Add(new SqlParameter("pageSize", pageSize));
              
            if (accountId > 0 || value > 0)
            {
                query = query + "where";
            }
            if (accountId > 0)
            {
                query = query + "   account.id = @accountId"; whereAdded = true;
                sqlParams.Add(new SqlParameter("accountId", accountId));
            }
            if (value > 0)
            {
                if (whereAdded)
                {
                    query = query + " and  [journal].[value] > @value";
                }
                else { query = query + "  [journal].[value] > " + @value; }
                sqlParams.Add(new SqlParameter("@value", @value));
            }
            sqlParams.Add(new SqlParameter("accountId", accountId));
            query = query + "  ORDER BY id OFFSET(@pageNumber -1) * @pageSize ROWS FETCH NEXT @pageSize  ROWS ONLY";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
            metaData.total = Convert.ToInt32(dataTable.Rows[0][0]);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
             
            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Utils.GridWrap(json, metaData);

            //return Utils.RunQuery(connectionString, query, sqlParams.ToArray());
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
    public class JournalController : ApiController
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private IJournalController controller = new JournalControllerService();
        public JournalController()
        {
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol,int pageNumber,int pageSize,string sortColum ="id",string sortDirection= "asc", int accountId =0 ,int value=0)
        {
            return controller.Data(symbol, pageNumber, pageSize, sortColum, sortDirection,accountId, value);
        }

    }
}