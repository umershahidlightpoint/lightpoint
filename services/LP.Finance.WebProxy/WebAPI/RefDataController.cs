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

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class RefDataController : ApiController
    {
        private const string portfolioCode = "Portfolio A";
        private readonly string connectionString;

        public RefDataController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDb"].ToString();
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol.ToLower())
            {
                case "all":
                    result = new
                    {
                        funds = GetData(connectionString, "fund"),
                        custodians = GetData(connectionString, "custodian"),
                        brokers = GetData(connectionString, "broker"),
                    };
                    Utils.Save(result, "all");
                    break;
                case "fund":
                    result = GetData(connectionString, "fund");
                    Utils.Save(result, "fund");
                    break;
                case "custodian":
                    result = GetData(connectionString, "custodian");
                    Utils.Save(result, "custodian");
                    break;
                case "broker":
                    result = GetData(connectionString, "broker");
                    Utils.Save(result, "broker");
                    break;
            }

            return result;
        }

        private object GetData(string connection, string tablename)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query = $@"select * from {tablename} nolock";

            using (var con = new SqlConnection(connection))
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
}