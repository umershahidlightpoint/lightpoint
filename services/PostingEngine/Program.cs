using Newtonsoft.Json;
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
    public class Transaction
    {
        public string LpOrderId { get; set; }
        public string Action { get; set; }
        public string Symbol { get; set; }
        public string Side { get; set; }
        public double Quantity { get; set; }
        public string SecurityType { get; set; }
        public string CustodianCode { get; set; }
        public string ExecutionBroker { get; set; }
        public string TradeId { get; set; }
        public string Fund { get; set; }
        public string PMCode { get; set; }
        public string PortfolioCode { get; set; }

        public string Status { get; set; }
    }

    /// <summary>
    /// Model that knows how to insert / update it's self
    /// keep the model simple
    /// </summary>
    public class Journal
    {
        public int Id { get; set; }

        public String Source { get; set; }
        public Account Account { get; set; }
        public DateTime When { get; set; }
        public double Value { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into journal () values ()";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter()
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update
        {
            get
            {
                var sql = "update journal set a=b, c=d where id = @id";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter()
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

    }

    public class Account
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

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
            //RunAsync().GetAwaiter().GetResult();

            connection = new SqlConnection(connectionString);
            connection.Open();

            Setup(connection);


            
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

        /// <summary>
        /// Process the transaction recieved, it will generate two offesting journal entries.
        /// </summary>
        /// <param name="element"></param>
        private static void ProcessTransaction(Transaction element)
        {
            // For each row in the database determine the account Id associated with that Transaction, this is going to be based on some rules
            var existingJournals = GetJournals(element);

            if (existingJournals.Count() > 0)
            {
                // need to remove those entries

                // And recreate them
            }
            else
            {
                var accountToFrom = GetFromToAccount(element);

                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    Value = element.Quantity * -1
                };

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    Value = element.Quantity
                };

                // Now have two entries / credit / debit

                // Need to save both now
            }
        }

        static async Task RunAsync()
        {
            var result = await GetResults();

            var elements = JsonConvert.DeserializeObject<Transaction[]>(result);

            foreach( var element in elements)
            {
                try
                {
                    ProcessTransaction(element);
                } catch ( Exception exe )
                {
                    // Capture the exception and keep going
                    Error(exe, element);
                }
            }

            Console.WriteLine(elements);
        }

        private static Journal[] GetJournals(Transaction element)
        {
            return new Journal[] { new Journal { }, new Journal { } };
        }

        private static AccountToFrom GetFromToAccount(Transaction element)
        {
            return new AccountToFrom();
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
