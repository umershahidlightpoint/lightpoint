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

namespace LP.Finance.WebProxy.WebAPI
{
    public interface IAccountController
    {
        object Data(string symbol);
    }

    public class AccountControllerStub : IAccountController
    {
        public object Data(string symbol)
        {
            var content = "{}";

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var folder = currentDir + "MockData" + Path.DirectorySeparatorChar + "accounts.json";
            if (File.Exists(folder))
                content = File.ReadAllText(folder);

            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }
    }

    public class AccountControllerService : IAccountController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object Data(string symbol)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                    result = AllData();
                    break;
            }

            return result;
        }

        private object AllData()
        {
            var content = "{}";
             
            var query = $@"SELECT * FROM [account]";

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
    public class AccountController : ApiController
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private IAccountController controller = new AccountControllerService();
        public AccountController()
        {
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol)
        {
            return controller.Data(symbol);
        }

    }
}