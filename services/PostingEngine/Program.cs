using ConsoleApp1.Models;
using Newtonsoft.Json;
using PostingEngine;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    // "TradePrice":0.0,"TradeDate":"2019-06-21T00:00:00","Trader":"BMAY","Status":"Executed","Commission":0.0,"Fees":0.0,"NetMoney":0.0,"UpdatedOn":"2019-06-21T14:42:29.697"
    

    /// <summary>
    /// Model that knows how to insert / update it's self
    /// keep the model simple
    /// </summary>

    

    public class AccountToFrom
    {
        public Account From { get; set; }
        public Account To { get; set; }
    }

    class Program
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        private static readonly string webAPI = "http://localhost:9091/api/trade/data/ALL";
        private static SqlConnection connection;

        static void Main(string[] args)
        {
            connection = new SqlConnection(connectionString);
            connection.Open();

            RunAsync(connection).GetAwaiter().GetResult();


            //Setup(connection);


            
            var query = new SqlCommand("select * from journal", connection);
            var reader = query.ExecuteReader();
            while (reader.NextResult())
            {
            }

            connection.Close();
        }

        private static void Setup(SqlConnection connection)
        {
            // Accounts
            var account_category = "insert into account_category ( id, name ) values ( @id, @name )";
            var command = new SqlCommand(account_category, connection);
            command.Parameters.Add(new SqlParameter { ParameterName = "id", Value = 1 });
            command.Parameters.Add(new SqlParameter { ParameterName = "name", Value = "Cash" });

            command.ExecuteNonQuery();
        }

        private static void Error(Exception ex, Transaction element)
        {

        }


        static async Task RunAsync(SqlConnection connection)
        {
            var result = await GetResults();

            var elements = JsonConvert.DeserializeObject<Transaction[]>(result);

            foreach( var element in elements.Where(e=>!e.SecurityType.Equals("Journal")) )
            {
                try
                {
                    new Posting().Process(element, connection);
                } catch ( Exception exe )
                {
                    // Capture the exception and keep going
                    Error(exe, element);
                }
            }

            Console.WriteLine(elements);
        }


        private static async Task<string> GetResults()
        {
            Task<string> result = null;

            var client = new HttpClient();
            //client.DefaultRequestHeaders.Accept.Add()

            HttpResponseMessage response = await client.GetAsync(webAPI);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();

                Console.WriteLine(result);
            }

            return await result;
        }
    }
}
