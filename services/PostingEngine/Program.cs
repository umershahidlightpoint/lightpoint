using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine;
using PostingEngine.PostingRules;
using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    // "TradePrice":0.0,"TradeDate":"2019-06-21T00:00:00","Trader":"BMAY","Status":"Executed","Commission":0.0,"Fees":0.0,"NetMoney":0.0,"UpdatedOn":"2019-06-21T14:42:29.697"

    class Program
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        private static readonly string tradesURL = "http://localhost:9091/api/trade/data/ALL";
        private static readonly string allocationsURL = "http://localhost:9091/api/allocation/data/ALL";

        static void Main(string[] args)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // Cleanout all data
                // Cleanup(connection);

                // Setup key data tables
                Setup(connection);

                AccountCategory.Load(connection);
                Tag.Load(connection);

                var transaction = connection.BeginTransaction();
                var sw = new Stopwatch();

                var allocations = GetTransactions(allocationsURL);
                allocations.Wait();

                var allocationList = JsonConvert.DeserializeObject<Transaction[]>(allocations.Result);

                var postingEnv = new PostingEngineEnvironment(connection, transaction)
                {
                    Categories = AccountCategory.Categories,
                    Types = AccountType.All,
                    ValueDate = DateTime.Now.Date,
                    FxRates = new FxRates().Get(DateTime.Now.Date),
                    RunDate = System.DateTime.Now.Date,
                    Allocations = allocationList,
                };


                new JournalLog() { RunDate = postingEnv.RunDate,  Action = "Starting Batch Posting Engine -- Trades", ActionOn = DateTime.Now }.Save(connection, transaction);
                sw.Reset();
                sw.Start();
                // RUn the trades pass next
                int count = RunAsync(connection, transaction, postingEnv, tradesURL).GetAwaiter().GetResult();
                sw.Stop();

                // Save the messages accumulated during the Run
                foreach(var message in postingEnv.Messages)
                {
                    new JournalLog() { RunDate = postingEnv.RunDate, Action = $" Error : {message.Key}, Count : {message.Value}", ActionOn = DateTime.Now }.Save(connection, transaction);
                }

                new JournalLog() { RunDate = postingEnv.RunDate, Action = $"Completed Batch Posting Engine {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds/1000} s", ActionOn = DateTime.Now }.Save(connection, transaction);

                transaction.Commit();

                Console.WriteLine("Completed / Press Enter to Finish");
                Console.ReadKey();
            }
        }

        private static void Setup(SqlConnection connection)
        {
            // Pre load AccountCategory and AccountType
            var categories = AccountCategory.Load(connection);
            var accountTypes = AccountType.Load(connection);

            var transaction = connection.BeginTransaction();
            new Tag { TypeName = "Transaction", PropertyName = "SecurityType", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "Symbol", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "CustodianCode", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "Fund", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "ExecutionBroker", PkName = "unknown" }.Save(connection, transaction);
            transaction.Commit();


        }

        /// <summary>
        /// Cleanup, reset the state of the database so that we can repopulate as we test the posting rules
        /// </summary>
        /// <param name="connection"></param>
        private static void Cleanup(SqlConnection connection)
        {
            new SqlCommand("delete from account_tag", connection).ExecuteNonQuery();
            new SqlCommand("delete from ledger", connection).ExecuteNonQuery();
            new SqlCommand("delete from journal", connection).ExecuteNonQuery();
            new SqlCommand("delete from account", connection).ExecuteNonQuery();
            new SqlCommand("delete from tag", connection).ExecuteNonQuery();
            new SqlCommand("delete from account_category", connection).ExecuteNonQuery();
        }

        private static void Error(Exception ex, Transaction element)
        {

        }


        static async Task<int> RunAsync(SqlConnection connection, SqlTransaction transaction, PostingEngineEnvironment postingEnv, string transactionsURI)
        {
            var result = await GetTransactions(transactionsURI);

            var elements = JsonConvert.DeserializeObject<Transaction[]>(result);


            var minTradeDate = elements.Min(i => i.TradeDate.Date);
            var maxTradeDate = elements.Max(i => i.TradeDate.Date);

            var maxSettleDate = elements.Max(i => i.SettleDate.Date);

            var startDate = minTradeDate;
            var endDate = DateTime.Now.Date;

            var tradeData = elements.OrderBy(i => i.TradeDate.Date).ToList();

            while ( startDate <= endDate )
            {
                Console.WriteLine($"Processing for ValueDate {startDate}");

                postingEnv.ValueDate = startDate;
                postingEnv.FxRates = new FxRates().Get(startDate);

                foreach (var element in tradeData)
                {
                    try
                    {
                        new Posting().Process(postingEnv, element);
                    }
                    catch (Exception exe)
                    {
                        postingEnv.AddMessage(exe.Message);

                        Error(exe, element);
                    }
                }

                startDate = startDate.AddDays(1);
            }

            new JournalLog() { RunDate = postingEnv.RunDate, Action = $"Processed # {elements.Count()} transactions", ActionOn = DateTime.Now }.Save(connection, transaction);

            return elements.Count();
        }


        private static async Task<string> GetTransactions(string webURI)
        {
            Task<string> result = null;

            var client = new HttpClient();

            HttpResponseMessage response = await client.GetAsync(webURI);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }
    }
}
