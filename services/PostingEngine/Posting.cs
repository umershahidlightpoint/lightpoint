using LP.Finance.Common;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PostingEngine
{
    public delegate void PostingEngineCallBack(string log, int totalRecords = 0, int recordsProcessed = 0);

    public static class PostingEngine
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private static readonly string accrualsURL = "http://localhost:9091/api/accruals/data?period=";
        private static readonly string tradesURL = "http://localhost:9091/api/trade/data?period=";
        private static readonly string allocationsURL = "http://localhost:9091/api/allocation/data?period=";

        private static string Period;
        private static Guid Key;
        private static PostingEngineCallBack PostingEngineCallBack;

        public static void Start(string period, Guid key, PostingEngineCallBack postingEngineCallBack)
        {
            Period = period;
            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                PostingEngineCallBack?.Invoke("Posting Engine Started");

                // Cleanout all data
                Cleanup(connection, period);

                // Setup key data tables
                Setup(connection);

                AccountCategory.Load(connection);
                Tag.Load(connection);

                var transaction = connection.BeginTransaction();
                var sw = new Stopwatch();

                var allocations = GetTransactions(allocationsURL + Period);
                var trades = GetTransactions(tradesURL + Period);
                var accruals = GetTransactions(accrualsURL + Period);
                Task.WaitAll(new Task[] {allocations, trades, accruals});

                var allocationsResult = JsonConvert.DeserializeObject<PayLoad>(allocations.Result);

                var allocationList = JsonConvert.DeserializeObject<Transaction[]>(allocationsResult.payload);
                var tradeList = JsonConvert.DeserializeObject<Transaction[]>(trades.Result);
                var accrualList = JsonConvert.DeserializeObject<Wrap<Accrual>>(accruals.Result).Data;

                var postingEnv = new PostingEngineEnvironment(connection, transaction)
                {
                    Categories = AccountCategory.Categories,
                    Types = AccountType.All,
                    ValueDate = DateTime.Now.Date,
                    FxRates = new FxRates().Get(DateTime.Now.Date),
                    RunDate = System.DateTime.Now.Date,
                    Allocations = allocationList,
                    Trades = tradeList,
                    Accruals = accrualList.ToDictionary(i => i.AccrualId, i => i),
                    Period = period
                };

                PostingEngineCallBack?.Invoke("Starting Batch Posting Engine -- Trades on" + DateTime.Now);

                new JournalLog()
                {
                    Key = Key, RunDate = postingEnv.RunDate, Action = "Starting Batch Posting Engine -- Trades",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);
                sw.Reset();
                sw.Start();
                // Run the trades pass next
                int count = RunAsync(connection, transaction, postingEnv).GetAwaiter().GetResult();
                sw.Stop();

                if (postingEnv.Journals.Count() > 0)
                {
                    new SQLBulkHelper().Insert("journal", postingEnv.Journals.ToArray(), connection, transaction);
                }

                var journalLogs = new List<JournalLog>();

                // Save the messages accumulated during the Run
                foreach (var message in postingEnv.Messages)
                {
                    journalLogs.Add(new JournalLog()
                    {
                        Key = Key, RunDate = postingEnv.RunDate,
                        Action = $" Error : {message.Key}, Count : {message.Value}", ActionOn = DateTime.Now
                    });
                }

                new SQLBulkHelper().Insert("journal_log", journalLogs.ToArray(), connection, transaction);

                new JournalLog()
                {
                    Key = Key, RunDate = postingEnv.RunDate,
                    Action =
                        $"Completed Batch Posting Engine {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds / 1000} s",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);

                transaction.Commit();
                postingEngineCallBack?.Invoke("Posting Engine Processing Completed");
            }
        }

        static async Task<int> RunAsync(SqlConnection connection, SqlTransaction transaction,
            PostingEngineEnvironment postingEnv)
        {
            var minTradeDate = postingEnv.Trades.Min(i => i.TradeDate.Date);
            var maxTradeDate = postingEnv.Trades.Max(i => i.TradeDate.Date);

            var maxSettleDate = postingEnv.Trades.Max(i => i.SettleDate.Date);

            var valueDate = minTradeDate;
            var endDate = DateTime.Now.Date;

            int totalDays = (int) (endDate - valueDate).TotalDays;
            int daysProcessed = 0;

            while (valueDate <= endDate)
            {
                postingEnv.ValueDate = valueDate;
                postingEnv.FxRates = new FxRates().Get(valueDate);

                var tradeData = postingEnv.Trades.Where(i => i.TradeDate <= valueDate).OrderBy(i => i.TradeDate.Date)
                    .ToList();

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

                if (postingEnv.Journals.Count() > 0)
                {
                    new SQLBulkHelper().Insert("journal", postingEnv.Journals.ToArray(), connection, transaction);

                    // Do not want them to be double posted
                    postingEnv.Journals.Clear();
                }

                PostingEngineCallBack?.Invoke($"Completed {valueDate}", totalDays, daysProcessed++);
                valueDate = valueDate.AddDays(1);
            }

            PostingEngineCallBack?.Invoke($"Processed # {postingEnv.Trades.Count()} transactions on " + DateTime.Now);
            new JournalLog()
            {
                Key = Key, RunDate = postingEnv.RunDate,
                Action = $"Processed # {postingEnv.Trades.Count()} transactions", ActionOn = DateTime.Now
            }.Save(connection, transaction);

            return postingEnv.Trades.Count();
        }

        private static void Setup(SqlConnection connection)
        {
            // Pre load AccountCategory and AccountType
            var categories = AccountCategory.Load(connection);
            var accountTypes = AccountType.Load(connection);

            /*
            var transaction = connection.BeginTransaction();
            new Tag { TypeName = "Transaction", PropertyName = "SecurityType", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "Symbol", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "CustodianCode", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "Fund", PkName = "unknown" }.Save(connection, transaction);
            new Tag { TypeName = "Transaction", PropertyName = "ExecutionBroker", PkName = "unknown" }.Save(connection, transaction);
            transaction.Commit();
            */
        }

        /// <summary>
        /// Cleanup, This will be driven by the UI
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="period">Period with which to run with</param>
        private static void Cleanup(SqlConnection connection, string period)
        {
            Tuple<DateTime, DateTime> datePeriod;

            switch (period)
            {
                case "ITD":
                    datePeriod = System.DateTime.Now.ITD();
                    break;
                case "MTD":
                    datePeriod = System.DateTime.Now.MTD();
                    break;
                default:
                    datePeriod = System.DateTime.Now.Today();
                    break;
            }

            var startdate = datePeriod.Item1.ToString("MM-dd-yyyy") + " 00:00";
            var enddate = datePeriod.Item2.ToString("MM-dd-yyyy") + " 16:30";

            var whereClause =
                $"where [when] between CONVERT(datetime, '{startdate}') and CONVERT(datetime, '{enddate}')";

            // new SqlCommand("delete from ledger " + whereClause, connection).ExecuteNonQuery();
            new SqlCommand("delete from journal " + whereClause, connection).ExecuteNonQuery();

            if (period.Equals("ITD"))
            {
                new SqlCommand("delete from journal_log", connection).ExecuteNonQuery();
                new SqlCommand("delete from account_tag", connection).ExecuteNonQuery();
                new SqlCommand("delete from account", connection).ExecuteNonQuery();
            }
        }

        private static void Error(Exception ex, Transaction element)
        {
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

    public class Posting
    {
        /// <summary>
        /// Based on the environment we need to determine what to do.
        /// </summary>
        /// <param name="env">The Posting Environment</param>
        /// <param name="element">The Trade to process</param>
        public void Process(PostingEngineEnvironment env, Transaction element)
        {
            // Find me the rule
            var rule = env.rules.Where(i => i.Key.Equals(element.SecurityType)).FirstOrDefault().Value;

            if (rule == null)
            {
                env.AddMessage($"No rule associated with {element.SecurityType}");
                return;
            }

            if (!rule.IsValid(env, element))
            {
                env.AddMessage($"trade not valid to process {element.LpOrderId}");
                return;
            }

            if (!element.TradeType.ToLower().Equals("trade"))
            {
                env.AddMessage($"Skipping Trade {element.TradeType}");
                return;
            }

            if (env.ValueDate == element.TradeDate.Date)
            {
                try
                {
                    rule.TradeDateEvent(env, element);
                }
                catch (Exception ex)
                {
                    env.AddMessage($"Unable to process the Event for Trade Date {ex.Message}");
                }
            }
            else if (env.ValueDate == element.SettleDate.Date)
            {
                try
                {
                    rule.SettlementDateEvent(env, element);
                }
                catch (Exception ex)
                {
                    env.AddMessage($"Unable to process the Event for Settlement Date {ex.Message}");
                }
            }
            else if (env.ValueDate > element.TradeDate.Date && env.ValueDate < element.SettleDate.Date)
            {
                try
                {
                    rule.DailyEvent(env, element);
                }
                catch (Exception ex)
                {
                    env.AddMessage($"Unable to process the Event for Daily Event {ex.Message}");
                }
            }
            else
            {
                //env.AddMessage($"Trade ignored ValueDate = {env.ValueDate}, TradeDate = {element.TradeDate.Date}, Settledate = {element.SettleDate.Date}");
            }
        }

        private Journal[] GetJournals(Transaction element)
        {
            return new Journal[] { };
        }

        private Account FindAccount(string accountName, Transaction element)
        {
            var accountType = AccountType.All
                .Where(i => i.Name.ToLowerInvariant().Equals(accountName.ToLowerInvariant())).FirstOrDefault();

            // Now we have the account type, so now need to create the account details
            var account = new Account {Type = accountType};

            return null;
        }
    }
}