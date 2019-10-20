using LP.Finance.Common;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine.TaxLotMethods;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
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

        private static readonly string root = "http://dev11";

        private static readonly string accrualsURL = root + ":9091/api/accruals/data?period=";
        private static readonly string tradesURL = root + ":9091/api/trade/data?period=";
        private static readonly string allocationsURL = root + ":9091/api/allocation/data?period=";

        private static string Period;
        private static Guid Key;
        private static PostingEngineCallBack PostingEngineCallBack;

        public static void CalculateCostBasis()
        {
            PostingEngineCallBack?.Invoke("Cost Basis Calculation Started");

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var transaction = connection.BeginTransaction();

                PostingEngineCallBack?.Invoke("Getting Trade Data");

                var trades = GetTransactions(tradesURL + "ITD");
                Task.WaitAll(new Task[] { trades});

                var tradeList = JsonConvert.DeserializeObject<Transaction[]>(trades.Result);

                var minTradeDate = tradeList.Min(i => i.TradeDate.Date);
                var maxTradeDate = tradeList.Max(i => i.TradeDate.Date);

                var valueDate = minTradeDate;
                var endDate = DateTime.Now.Date;

                var rowsCompleted = 1;
                var numberOfDays = (endDate - valueDate).Days;
                while (valueDate <= endDate)
                {
                    try
                    {
                        CostBasisDto.Calculate(connection, transaction, valueDate);
                    }
                    catch ( Exception ex )
                    {
                        PostingEngineCallBack?.Invoke($"Exception on {valueDate}, {ex.Message}");
                    }

                    PostingEngineCallBack?.Invoke($"Complete CostBasis for {valueDate}", numberOfDays, rowsCompleted++);
                    valueDate = valueDate.AddDays(1);
                }

                transaction.Commit();
                
            }
        }

        public static void RunCalculation(string calculation, Guid key, PostingEngineCallBack postingEngineCallBack)
        {
            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            // Driven by calculation

            CalculateCostBasis();
        }

        /// <summary>
        /// Only process the past trade
        /// </summary>
        /// <param name="LpOrderId"></param>
        /// <param name="key"></param>
        /// <param name="postingEngineCallBack"></param>
        public static void StartSingleTrade(string LpOrderId, Guid key, PostingEngineCallBack postingEngineCallBack)
        {
            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                PostingEngineCallBack?.Invoke("Posting Engine Started");

                // Load up reference tables
                AccountCategory.Load(connection);
                AccountType.Load(connection);
                Tag.Load(connection);

                var transaction = connection.BeginTransaction();
                var sw = new Stopwatch();

                var allocations = GetTransactions(allocationsURL + "ITD");
                var trades = GetTransactions(tradesURL + "ITD");
                var accruals = GetTransactions(accrualsURL + "ITD");
                Task.WaitAll(new Task[] { allocations, trades, accruals });

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
                };

                PostingEngineCallBack?.Invoke($"Starting Single Trade Posting Engine -- {LpOrderId} : {DateTime.Now}");

                new JournalLog()
                {
                    Key = Key,
                    RunDate = postingEnv.RunDate,
                    Action = "Starting Single Trade Posting Engine",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);
                sw.Reset();
                sw.Start();
                // Run the trades pass next
                int count = RunAsync(connection, transaction, postingEnv, LpOrderId).GetAwaiter().GetResult();
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
                        Key = Key,
                        RunDate = postingEnv.RunDate,
                        Action = $" Error : {message.Key}, Count : {message.Value}",
                        ActionOn = DateTime.Now
                    });
                }

                new SQLBulkHelper().Insert("journal_log", journalLogs.ToArray(), connection, transaction);

                new JournalLog()
                {
                    Key = Key,
                    RunDate = postingEnv.RunDate,
                    Action =
                        $"Completed Batch Posting Engine {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds / 1000} s",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);

                transaction.Commit();
                postingEngineCallBack?.Invoke("Posting Engine Processing Completed");
            }
        }

        /// <summary>
        /// Process all entries in the past date range
        /// </summary>
        /// <param name="period"></param>
        /// <param name="key"></param>
        /// <param name="postingEngineCallBack"></param>
        public static void Start(string period, Guid key, DateTime businessDate, PostingEngineCallBack postingEngineCallBack)
        {
            Period = period;
            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                PostingEngineCallBack?.Invoke("Posting Engine Started");

                // Cleanout all data
                PostingEngineCallBack?.Invoke("Cleanup");
                Cleanup(connection, period);

                // Setup key data tables
                PostingEngineCallBack?.Invoke("Preload Data");
                Setup(connection);

                PostingEngineCallBack?.Invoke("Getting Trade / Allocation / Accruals");
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
                    BusinessDate = businessDate,
                    RunDate = System.DateTime.Now.Date,
                    Allocations = allocationList,
                    Trades = tradeList,
                    Accruals = accrualList.ToDictionary(i => i.AccrualId, i => i),
                    Period = period,
                    Methodology = new FIFOTaxLotMethod() // Needs to be driven by the system setup
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

        private static void DeleteJournalsForOrder(string orderId)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            try
            {
                sqlHelper.VerifyConnection();

                List<SqlParameter> journalParameters = new List<SqlParameter>
                {
                    new SqlParameter("source", orderId)
                };

                var journalQuery = $@"DELETE FROM [journal]
                                    WHERE [journal].[source] = @source";

                sqlHelper.Delete(journalQuery, CommandType.Text, journalParameters.ToArray());

                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                PostingEngineCallBack?.Invoke($"Unable to delete Journal Entries for {orderId}, {ex.Message}");
            }
        }

        /// <summary>
        /// Process a single Trade
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="transaction"></param>
        /// <param name="postingEnv"></param>
        /// <param name="lpOrderId"></param>
        /// <returns></returns>
        static async Task<int> RunAsync(SqlConnection connection, SqlTransaction transaction, PostingEngineEnvironment postingEnv, string lpOrderId)
        {
            var trade = postingEnv.Trades.Where(i => i.LpOrderId == lpOrderId).First();

            // Get the Journals for this trade if they exist
            DeleteJournalsForOrder(trade.LpOrderId);

            var valueDate = trade.TradeDate;
            var endDate = DateTime.Now.Date;

            int totalDays = (int)(endDate - valueDate).TotalDays;
            int daysProcessed = 0;

            while (valueDate <= endDate)
            {
                postingEnv.ValueDate = valueDate;
                postingEnv.FxRates = new FxRates().Get(valueDate);

                try
                {
                    new Posting().Process(postingEnv, trade);
                }
                catch (Exception exe)
                {
                    postingEnv.AddMessage(exe.Message);

                    Error(exe, trade);
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

            PostingEngineCallBack?.Invoke($"Processed #1 transactions on " + DateTime.Now);
            new JournalLog()
            {
                Key = Key,
                RunDate = postingEnv.RunDate,
                Action = $"Processed #1 transactions",
                ActionOn = DateTime.Now
            }.Save(connection, transaction);

            return postingEnv.Trades.Count();
        }

        static async Task<int> RunAsync(SqlConnection connection, SqlTransaction transaction, PostingEngineEnvironment postingEnv)
        {
            var minTradeDate = postingEnv.Trades.Min(i => i.TradeDate.Date);
            //var maxTradeDate = postingEnv.Trades.Max(i => i.TradeDate.Date);

            //var maxSettleDate = postingEnv.Trades.Max(i => i.SettleDate.Date);

            var valueDate = minTradeDate;
            var endDate = postingEnv.BusinessDate;

            int totalDays = (int) (endDate - valueDate).TotalDays;
            int daysProcessed = 0;

            var ignoreTrades = new List<string>();

            while (valueDate <= endDate)
            {
                if (!valueDate.IsBusinessDate())
                    continue;

                var sw = new Stopwatch();
                sw.Start();

                postingEnv.ValueDate = valueDate;

                // FX Rates
                postingEnv.FxRates = new FxRates().Get(valueDate);

                // Get todays Market Prices
                postingEnv.EODMarketPrices = new MarketPrices().Get(valueDate);
                postingEnv.PrevMarketPrices = new MarketPrices().Get(valueDate.AddDays(-1));

                postingEnv.CostBasis = new CostBasises().Get(valueDate.AddDays(-1));

                //PostingEngineCallBack?.Invoke($"Pulled FxRates {valueDate} in {sw.ElapsedMilliseconds} ms");

                var tradeData = postingEnv.Trades.Where(i => i.TradeDate <= valueDate).OrderBy(i => i.TradeDate.Date).ToList();

                //PostingEngineCallBack?.Invoke($"Sorted / Filtered Trades in {sw.ElapsedMilliseconds} ms");

                foreach (var element in tradeData)
                {
                    // We only process trades that have not broken
                    if (ignoreTrades.Contains(element.LpOrderId))
                        continue;

                    try
                    {
                        var processed = new Posting().Process(postingEnv, element);
                        if ( !processed )
                        {
                            // Lets add to the ignore list
                            ignoreTrades.Add(element.LpOrderId);
                        }
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
                sw.Stop();

                PostingEngineCallBack?.Invoke($"Completed {valueDate} in {sw.ElapsedMilliseconds} ms", totalDays, daysProcessed++);
                valueDate = valueDate.AddDays(1);
            }

            PostingEngineCallBack?.Invoke($"Processed # {postingEnv.Trades.Count()} transactions on " + DateTime.Now);
            new JournalLog()
            {
                Key = Key, RunDate = postingEnv.RunDate,
                Action = $"Processed # {postingEnv.Trades.Count()} transactions", ActionOn = DateTime.Now
            }.Save(connection, transaction);

            if (postingEnv.TaxLotStatus.Count() > 0)
            {
                // TO DO
                new SQLBulkHelper().Insert("tax_lot_status", postingEnv.TaxLotStatus.Values.ToArray(), connection, transaction);

                // Do not want them to be double posted
                postingEnv.TaxLotStatus.Clear();
            }

            return postingEnv.Trades.Count();
        }

        /// <summary>
        /// Preload data into the system
        /// </summary>
        /// <param name="connection"></param>
        private static void Setup(SqlConnection connection)
        {
            AccountCategory.Load(connection);
            AccountType.Load(connection);
            Account.Load(connection);
            Tag.Load(connection);
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
                // We need to preserve the Accounts, so once created we are good to go
                //new SqlCommand("delete from account_tag", connection).ExecuteNonQuery();
                //new SqlCommand("delete from account", connection).ExecuteNonQuery();

                new SqlCommand("delete from journal_log", connection).ExecuteNonQuery();
                new SqlCommand("delete from tax_lot", connection).ExecuteNonQuery();
                new SqlCommand("delete from tax_lot_status", connection).ExecuteNonQuery();
                new SqlCommand("delete from cost_basis", connection).ExecuteNonQuery();

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
        public bool Process(PostingEngineEnvironment env, Transaction element)
        {
            // Identify which entries to skip
            if ( element.Status.Equals("Cancelled") || element.Status.Equals("Expired"))
            {
                env.AddMessage($"Trade has been cancelled || expired {element.LpOrderId} -- {element.Status}");
                // TODO: if there is already a Journal entry for this trade we need to back out the entries
                return false;
            }

            // Lets ignore this for the moment
            /*
            if (element.TradeType.ToLower().Equals("kickout"))
            {
                env.AddMessage($"Trade is a kickout ignoring {element.LpOrderId}");
                return false;
            }

            if (!element.TradeType.ToLower().Equals("trade"))
            {
                env.AddMessage($"Skipping Trade {element.TradeType}");
                return false;
            }
            */

            // Find me the rule
            var rule = env.rules.Where(i => i.Key.Equals(element.SecurityType)).FirstOrDefault().Value;
            if (rule == null)
            {
                env.AddMessage($"No rule associated with {element.SecurityType}");
                return false;
            }

            if (!rule.IsValid(env, element))
            {
                // Defer message to the rule
                //env.AddMessage($"trade not valid to process {element.LpOrderId} -- {element.SecurityType}");
                return false;
            }

            if (env.ValueDate == element.TradeDate.Date)
            {
                try
                {
                    rule.TradeDateEvent(env, element);
                    rule.DailyEvent(env, element);
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
                    rule.DailyEvent(env, element);
                }
                catch (Exception ex)
                {
                    env.AddMessage($"Unable to process the Event for Settlement Date {ex.Message}");
                }
            }
            else if (env.ValueDate > element.TradeDate.Date)
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
                
            }

            return true;
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