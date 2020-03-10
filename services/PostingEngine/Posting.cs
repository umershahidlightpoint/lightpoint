using LP.Finance.Common;
using LP.Finance.Common.Calculators;
using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine.Contracts;
using PostingEngine.CorporateActions;
using PostingEngine.Extensions;
using PostingEngine.MarketData;
using PostingEngine.PostingRules;
using PostingEngine.PostingRules.Utilities;
using PostingEngine.Tasks;
using PostingEngine.TaxLotMethods;
using SqlDAL.Core;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace PostingEngine
{
    public delegate void PostingEngineCallBack(string log, int totalRecords = 0, int recordsProcessed = 0);

    public static class PostingEngine
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private static readonly string urlRoot = ConfigurationManager.AppSettings["root"].ToString();

        private static readonly string accrualsURL = urlRoot + ":9091/api/accruals/data?period=";
        private static readonly string tradesURL = urlRoot + ":9091/api/trade/data?period=";
        private static readonly string allocationsURL = urlRoot + ":9091/api/allocation/data?period=";

        private static string taxLotMethodology = ConfigurationManager.AppSettings["TaxMethod"].ToString();

        // Name of the client that is using the system
        private static readonly string clientName = ConfigurationManager.AppSettings["Client"].ToString();

        private static string Period;
        private static Guid Key;
        private static PostingEngineCallBack PostingEngineCallBack;

        public static void CacheData()
        {
            PostingEngineCallBack?.Invoke("Start Caching Result");
            var sqlParams = new SqlParameter[]
            {
                new SqlParameter("BatchSize", 100000)
            };            
            var dataTable = new SqlHelper(connectionString).GetDataTables("CacheBatchResults_rd", CommandType.StoredProcedure, sqlParams, Logger);
            PostingEngineCallBack?.Invoke("End Caching Result");

            PostingEngineCallBack?.Invoke("Start PostProcessETL");
            dataTable = new SqlHelper(connectionString).GetDataTables("PostProcessETL", CommandType.StoredProcedure, null, Logger);
            PostingEngineCallBack?.Invoke("End PostProcessETL");
        }

        public static void RunAction(string action, string period, DateTime valueDate, Guid key, PostingEngineCallBack postingEngineCallBack)
        {
            var env = new PostingEngineEnvironment()
            {
                ConnectionString = connectionString,
                CallBack = postingEngineCallBack,
                BaseCurrency = "USD",
                Period = period,
                ValueDate = valueDate,
            };

            SetupEnvironment.Setup(env.ConnectionString);

            Key = key;
            PostingEngineCallBack = postingEngineCallBack;
            var taskList = new List<Task<bool>>();

            var calc = PostingTasks.Get(action);
            taskList.Add(PostingTasks.RunTask(env, calc));

            Task.WaitAll(taskList.ToArray());

        }

        public static void RunCalculation(string calculation, string period, DateTime valueDate, Guid key, PostingEngineCallBack postingEngineCallBack)
        {
            var env = new PostingEngineEnvironment()
            {
                ConnectionString = connectionString,
                CallBack = postingEngineCallBack,
                BaseCurrency = "USD",
                Period = period,
                ValueDate = valueDate,
            };

            SetupEnvironment.Setup(env.ConnectionString);

            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            // Driven by calculation

            if (calculation.Equals("CostBasisAndDayPnl"))
            {
                var taskList = new List<Task<bool>>();

                var calc = PostingTasks.Get("costbasis");
                taskList.Add(PostingTasks.RunTask(env, calc));

                Task.WaitAll(taskList.ToArray());
            }
            else if (calculation.Equals("PullFromBookmon"))
            {
                Logger.Info("Pulling Data from Legacy System");

                var calc = PostingTasks.Get("pullfrombookmon");
                var result = PostingTasks.RunTask(env, calc);
                result.Wait();
            }
            else if ( calculation.Equals("ExpencesAndRevenues"))
            {
                var taskList = new List<Task<bool>>();

                Logger.Info("Running ExpencesAndRevenues");

                var calc = PostingTasks.Get("expencesandrevenues");
                taskList.Add(PostingTasks.RunTask(env, calc));

                calc = PostingTasks.Get("dailypnl");
                taskList.Add(PostingTasks.RunTask(env, calc));

                calc = PostingTasks.Get("settledcashbalances");
                taskList.Add(PostingTasks.RunTask(env, calc));

                Task.WaitAll(taskList.ToArray());
            }
            else if (calculation.Equals("CacheData"))
            {
                Logger.Info("CachingData");
                CacheData();
            }
            else if (calculation.Equals("EndOfYear"))
            {
                var calc = PostingTasks.Get("endofyear");
                env.ValueDate = new DateTime(2020, 1, 1);

                var result = PostingTasks.RunTask(env, calc);
                result.Wait();
            }
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

            var allocations = GetTransactions(allocationsURL + "ITD");
            var trades = GetTransactions(tradesURL + "ITD");
            var accruals = GetTransactions(accrualsURL + "ITD");
            Task.WaitAll(new Task[] { allocations, trades, accruals });

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


                var allocationsResult = JsonConvert.DeserializeObject<PayLoad>(allocations.Result);

                var allocationList = JsonConvert.DeserializeObject<Transaction[]>(allocationsResult.payload);
                var tradeList = JsonConvert.DeserializeObject<Transaction[]>(trades.Result);
                var accrualList = JsonConvert.DeserializeObject<Wrap<Accrual>>(accruals.Result).Data;

                var postingEnv = new PostingEngineEnvironment(connection, transaction)
                {
                    BaseCurrency = "USD",
                    SecurityDetails = new SecurityDetails().Get(),
                    ValueDate = DateTime.Now.Date,
                    PreviousValueDate = DateTime.Now.Date.PrevBusinessDate(),
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
                    postingEnv.CollectData(postingEnv.Journals);
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
        public static void RunForPeriod(string period, Guid key, DateTime businessDate, PostingEngineCallBack postingEngineCallBack)
        {
            Period = period;
            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            var allocations = GetTransactions(allocationsURL + "ITD");
            var trades = GetData<Transaction>(connectionString + ";Application Name=PostingEngine", TradeApi.TRADE_QUERY);
            var accruals = GetTransactions(accrualsURL + "ITD");

            using (var connection = new SqlConnection(connectionString + ";Application Name=PostingEngine"))
            {
                connection.Open();

                PostingEngineCallBack?.Invoke("Posting Engine Started");

                // Cleanout all data
                PostingEngineCallBack?.Invoke("Cleanup");
                try
                {
                    Cleanup(connection, period);
                }
                catch (Exception ex)
                {
                    Logger.Debug(ex, "");
                    throw ex;
                }

                // Setup key data tables
                PostingEngineCallBack?.Invoke("Preload Data");
                SetupEnvironment.Setup(connection);

                PostingEngineCallBack?.Invoke("Getting Trade / Allocation / Accruals");
                var sw = new Stopwatch();

                Task.WaitAll(new Task[] { allocations, trades, accruals });

                var allocationsResult = JsonConvert.DeserializeObject<PayLoad>(allocations.Result);

                var allocationList = JsonConvert.DeserializeObject<Transaction[]>(allocationsResult.payload);


                var localTradeList = trades.Result.ToArray();

                var finalTradeList = ClientSpecifics.ClientSpecificsFactory.Get("base").Transform(localTradeList);

                // Defer to the this Factory to determine how the trade list is mutated, if the client is not recognized then
                // we use the default Specification for the trade List.
                finalTradeList = ClientSpecifics.ClientSpecificsFactory.GetImplementation(clientName).Transform(finalTradeList);

                var accrualList = JsonConvert.DeserializeObject<Wrap<Accrual>>(accruals.Result).Data;
                PostingEngineCallBack?.Invoke("Retrieved All Data");

                if (String.IsNullOrEmpty(taxLotMethodology))
                    taxLotMethodology = "FIFO";

                PostingEngineCallBack?.Invoke($"Using {taxLotMethodology} Tax Methodology");

                var tradingPostingEnv = CreateTradingEnvironment(businessDate, period, new SqlConnection(connectionString + ";Application Name=PostingEngine-Trades"), null);
                var journalPostingEnv = CreateTradingEnvironment(businessDate, period, new SqlConnection(connectionString + ";Application Name=PostingEngine-Journals"), null);

                tradingPostingEnv.Allocations = allocationList;
                tradingPostingEnv.CallBack = PostingEngineCallBack;
                tradingPostingEnv.Trades = finalTradeList;
                tradingPostingEnv.Accruals = accrualList.ToDictionary(i => i.AccrualId, i => i);

                journalPostingEnv.Allocations = allocationList;
                journalPostingEnv.CallBack = PostingEngineCallBack;
                journalPostingEnv.Trades = finalTradeList;
                journalPostingEnv.Accruals = accrualList.ToDictionary(i => i.AccrualId, i => i);

                PostingEngineCallBack?.Invoke($"Starting Batch Posting Engine -- Trades on {DateTime.Now}");

                new JournalLog()
                {
                    Key = Key, RunDate = tradingPostingEnv.RunDate, Action = "Starting Batch Posting Engine -- Trades",
                    ActionOn = DateTime.Now
                }.Save(tradingPostingEnv.Connection, tradingPostingEnv.Transaction);


                // Run the trades pass next
                // Lets do Trading Activity, so no Journals
                sw.Reset();

                // differentiating between trades and journals. Moving forward we can create journal entries per symbol in a parallel fashion.
                tradingPostingEnv.SkipWeekends = true;
                tradingPostingEnv.Rules = tradingPostingEnv.TradingRules;
                tradingPostingEnv.Trades = finalTradeList.Where(i => !i.SecurityType.Equals("Journals")).ToArray();
                tradingPostingEnv.CallBack = postingEngineCallBack;

                Dividends.CacheDividends(tradingPostingEnv);

                journalPostingEnv.SkipWeekends = false;
                journalPostingEnv.Rules = tradingPostingEnv.JournalRules;
                journalPostingEnv.Trades = finalTradeList.Where(i => i.SecurityType.Equals("Journals")).ToArray();
                journalPostingEnv.CallBack = postingEngineCallBack;

                var tasks = new List<Task>
                {
                    Task.Run(() => Process(tradingPostingEnv, false)),
                    Task.Run(() => Process(journalPostingEnv, true))
                };

                Task.WaitAll(tasks.ToArray());

                var journals = new List<Journal>();
                journals.AddRange(tradingPostingEnv.Journals);
                journals.AddRange(journalPostingEnv.Journals);

                var asyncResults = Task.Run(() => tradingPostingEnv.CollectData(journals));

                var journalLogs = new List<JournalLog>();

                // Save the messages accumulated during the Run
                foreach (var message in tradingPostingEnv.Messages)
                {
                    journalLogs.Add(new JournalLog()
                    {
                        Key = Key,
                        RunDate = tradingPostingEnv.RunDate,
                        Action = $" Error : {message.Key}, Count : {message.Value}", ActionOn = DateTime.Now
                    });
                }

                foreach (var message in journalPostingEnv.Messages)
                {
                    journalLogs.Add(new JournalLog()
                    {
                        Key = Key,
                        RunDate = tradingPostingEnv.RunDate,
                        Action = $" Error : {message.Key}, Count : {message.Value}",
                        ActionOn = DateTime.Now
                    });
                }

                new SQLBulkHelper().Insert("journal_log", journalLogs.ToArray(), tradingPostingEnv.Connection, tradingPostingEnv.Transaction);

                new JournalLog()
                {
                    Key = Key, RunDate = tradingPostingEnv.RunDate,
                    Action =
                        $"Completed Batch Posting Engine {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds / 1000} s",
                    ActionOn = DateTime.Now
                }.Save(tradingPostingEnv.Connection, tradingPostingEnv.Transaction);

                if ( asyncResults != null )
                    asyncResults.Wait();

                tradingPostingEnv.Transaction.Commit();
                journalPostingEnv.Transaction.Commit();

                postingEngineCallBack?.Invoke("Posting Engine Processing Completed");
            }
        }

        private static PostingEngineEnvironment CreateTradingEnvironment(DateTime businessDate, String period, SqlConnection connection, SqlTransaction transaction)
        {
            connection.Open();
            if (transaction == null) transaction = connection.BeginTransaction();

            var postingEnv = new PostingEngineEnvironment(connection, transaction)
            {
                ConnectionString = connectionString,
                BaseCurrency = "USD",
                SecurityDetails = new SecurityDetails().Get(),
                BusinessDate = businessDate,
                RunDate = System.DateTime.Now.Date,
                Period = period,
                Methodology = BaseTaxLotMethodology.GetTaxLotMethodology(taxLotMethodology) // Needs to be driven by the system setup
            };

            return postingEnv;
        }

        public static void NonDesructive(string period, Guid key, DateTime businessDate, PostingEngineCallBack postingEngineCallBack)
        {
            Period = period;
            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            var allocations = GetTransactions(allocationsURL + Period);
            var trades = GetTransactions(tradesURL + Period);
            var accruals = GetTransactions(accrualsURL + Period);

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                PostingEngineCallBack?.Invoke("Posting Engine Started");

                // Cleanout all data
                PostingEngineCallBack?.Invoke("Cleanup");
                try
                {
                    Cleanup(connection, period);
                }
                catch (Exception ex)
                {
                    Logger.Debug(ex, "");
                    throw ex;
                }

                // Setup key data tables
                PostingEngineCallBack?.Invoke("Preload Data");
                SetupEnvironment.Setup(connection);

                PostingEngineCallBack?.Invoke("Getting Trade / Allocation / Accruals");
                var sw = new Stopwatch();

                Task.WaitAll(new Task[] { allocations, trades, accruals });

                var allocationsResult = JsonConvert.DeserializeObject<PayLoad>(allocations.Result);

                var allocationList = JsonConvert.DeserializeObject<Transaction[]>(allocationsResult.payload);
                var localTradeList = JsonConvert.DeserializeObject<Transaction[]>(trades.Result);

                var finalTradeList = localTradeList.Where(t => t.TradeDate >= new DateTime(2019, 4, 1)).ToArray();

                var accrualList = JsonConvert.DeserializeObject<Wrap<Accrual>>(accruals.Result).Data;
                PostingEngineCallBack?.Invoke("Retrieved All Data");

                if (String.IsNullOrEmpty(taxLotMethodology))
                    taxLotMethodology = "FIFO";

                PostingEngineCallBack?.Invoke($"Using {taxLotMethodology} Tax Methodology");

                var transaction = connection.BeginTransaction();

                var postingEnv = new PostingEngineEnvironment(connection, transaction)
                {
                    ConnectionString = connectionString,
                    BaseCurrency = "USD",
                    SecurityDetails = new SecurityDetails().Get(),
                    BusinessDate = businessDate,
                    RunDate = System.DateTime.Now.Date,
                    Allocations = allocationList,
                    Trades = finalTradeList,
                    Accruals = accrualList.ToDictionary(i => i.AccrualId, i => i),
                    Period = period,
                    Methodology = BaseTaxLotMethodology.GetTaxLotMethodology(taxLotMethodology) // Needs to be driven by the system setup
                };

                PostingEngineCallBack?.Invoke($"Starting Batch Posting Engine -- Trades on {DateTime.Now}");

                new JournalLog()
                {
                    Key = Key,
                    RunDate = postingEnv.RunDate,
                    Action = "Starting Batch Posting Engine -- Trades",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);


                // Run the trades pass next
                // Lets do Trading Activity, so no Journals
                sw.Reset();
                sw.Start();

                PostingEngineCallBack?.Invoke($"Processing Trades on {DateTime.Now}");

                // differentiating between trades and journals. Moving forward we can create journal entries per symbol in a parallel fashion.
                postingEnv.SkipWeekends = true;
                postingEnv.Rules = postingEnv.TradingRules;
                postingEnv.Trades = finalTradeList.Where(i => !i.SecurityType.Equals("Journals")).ToArray();
                postingEnv.CallBack = postingEngineCallBack;
                int count = Process(postingEnv).GetAwaiter().GetResult();
                sw.Stop();

                // Lets do the Journal Activity and only Journals
                // zz_ journal entries from legacy system. just create double entry in portfolio accounting for each journal entry in the legacy system.
                PostingEngineCallBack?.Invoke($"Processing Journals on {DateTime.Now}");
                sw.Start();
                postingEnv.SkipWeekends = false;
                postingEnv.Rules = postingEnv.JournalRules;
                postingEnv.Trades = finalTradeList.Where(i => i.SecurityType.Equals("Journals")).ToArray();
                postingEnv.CallBack = postingEngineCallBack;
                count = count + Process(postingEnv).GetAwaiter().GetResult();
                sw.Stop();

                Task<int> asyncResults = null;

                if (postingEnv.Journals.Count() > 0)
                {
                    asyncResults = Task.Run(() => postingEnv.CollectData(postingEnv.Journals));

                    //CollectData(postingEnv, postingEnv.Journals);
                    //Journals.Add(postingEnv.Journals);
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

                if (asyncResults != null)
                    asyncResults.Wait();

                transaction.Commit();
                postingEngineCallBack?.Invoke("Posting Engine Processing Completed");
            }
        }

        private static void DeleteJournals(string eventName)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            try
            {
                sqlHelper.VerifyConnection();

                List<SqlParameter> journalParameters = new List<SqlParameter>
                {
                    new SqlParameter("event", eventName)
                };

                var journalQuery = $@"DELETE FROM [journal]
                                    WHERE [journal].[event] = @event";

                sqlHelper.Delete(journalQuery, CommandType.Text, journalParameters.ToArray());

                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                PostingEngineCallBack?.Invoke($"Unable to delete Journal Entries for Event : {eventName}, {ex.Message}");
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
                postingEnv.PreviousValueDate = valueDate.PrevBusinessDate();

                postingEnv.TaxRate = new TaxRates().Get(valueDate);

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
                    postingEnv.CollectData(postingEnv.Journals);
                    //Journals.Add(postingEnv.Journals);

                    // Do not want them to be double posted
                    postingEnv.Journals.Clear();
                }

                PostingEngineCallBack?.Invoke($"Completed {valueDate.ToString("MM-dd-yyyy")}", totalDays, daysProcessed++);
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

        static async Task<int> Process(PostingEngineEnvironment postingEnv, bool journalsOnly = false)
        {
            var label = journalsOnly ? "Journals" : "Trades";

            PostingEngineCallBack?.Invoke($"Processing {label} on {DateTime.Now}");
            var sw = new Stopwatch();
            sw.Start();
            int count = RunAsync(postingEnv.Connection, postingEnv.Transaction, postingEnv, journalsOnly, label);
            sw.Stop();

            new JournalLog()
            {
                Key = Key,
                RunDate = postingEnv.RunDate,
                Action = $"Completed {label} Processing {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds / 1000} s",
                ActionOn = DateTime.Now
            }.Save(postingEnv.Connection, postingEnv.Transaction);

            return count;
        }
        /// <summary>
        /// Process all activity
        /// </summary>
        /// <param name="connection">Database connection</param>
        /// <param name="transaction">Transaction</param>
        /// <param name="postingEnv">The posting environment</param>
        /// <returns></returns>
        static int RunAsync(SqlConnection connection, SqlTransaction transaction, PostingEngineEnvironment postingEnv, bool journalsOnly = false, string label = "")
        {
            if (postingEnv.Trades.Count() == 0)
                return 0;

            var minTradeDate = postingEnv.Trades.Min(i => i.TradeDate.Date);
            var maxTradeDate = postingEnv.Trades.Max(i => i.TradeDate.Date);
            var maxSettleDate = postingEnv.Trades.Max(i => i.SettleDate.Date);

            var valueDate = minTradeDate;
            var endDate = maxTradeDate; // new DateTime(2019, 12,31);

            // Actually need this to run thru today
            // endDate = postingEnv.BusinessDate;

            if (maxSettleDate <= System.DateTime.Now)
            {
                endDate = maxSettleDate;
            }

            if ( postingEnv.Period.Equals("Today"))
            {
                valueDate = postingEnv.BusinessDate;
                endDate = postingEnv.BusinessDate;
            }

            endDate = postingEnv.BusinessDate;

            int totalDays = (int) (endDate - valueDate).TotalDays;
            int daysProcessed = 0;

            var ignoreTrades = new List<string>();

            while (valueDate <= endDate)
            {
                // Skipping none business dates, this is to ensure that we are not accumalating unrealizedpnl,
                // but we need to ensure that Journal's need to include weekends, so we need to treat this seperatly
                if (postingEnv.SkipWeekends)
                {
                    if (!valueDate.IsBusinessDate())
                    {
                        valueDate = valueDate.AddDays(1);
                        daysProcessed++;
                        continue;
                    }
                }

                var sw = new Stopwatch();
                sw.Start();

                postingEnv.ValueDate = valueDate;
                postingEnv.PreviousValueDate = valueDate.PrevBusinessDate();
                if (!journalsOnly)
                {
                    postingEnv.TaxRate = new TaxRates().Get(valueDate);

                    // Pull this data in incrementally
                    postingEnv.GetUnsettledPnl(postingEnv.PreviousValueDate);
                }

                var tradeData = postingEnv.Trades.Where(i => i.TradeDate <= valueDate).OrderBy(i => i.TradeTime).ToList();

                postingEnv.CallBack?.Invoke($"Processing {tradeData.Count()} {label}");

                if (!journalsOnly)
                {
                    // BUY || SHORT trades
                    // creates tax lots
                    var buyShort = tradeData.Where(i => i.TradeDate.Equals(valueDate) && (i.IsBuy() || i.IsShort())).ToList();
                    postingEnv.CallBack?.Invoke($"Processing BUY|SHORT {buyShort.Count()} Trades");
                    foreach (var trade in buyShort)
                    {
                        // We only process trades that have not broken
                        if (ignoreTrades.Contains(trade.LpOrderId))
                            continue;

                        try
                        {
                            var processed = new Posting().ProcessTradeEvent(postingEnv, trade);
                            if (!processed)
                            {
                                // Lets add to the ignore list
                                ignoreTrades.Add(trade.LpOrderId);
                            }
                        }
                        catch (Exception exe)
                        {
                            postingEnv.AddMessage(exe.Message);

                            Error(exe, trade);
                        }
                    }

                    // SELL || COVER trades
                    // alleviates tax lots
                    // generates realized pnl.
                    var sellCover = tradeData.Where(i => i.TradeDate.Equals(valueDate) && (i.IsSell() || i.IsCover())).ToList();
                    postingEnv.CallBack?.Invoke($"Processing SELL|COVER {sellCover.Count()} Trades");
                    foreach (var trade in sellCover)
                    {
                        // We only process trades that have not broken
                        if (ignoreTrades.Contains(trade.LpOrderId))
                            continue;

                        try
                        {
                            var processed = new Posting().ProcessTradeEvent(postingEnv, trade);
                            if (!processed)
                            {
                                // Lets add to the ignore list
                                ignoreTrades.Add(trade.LpOrderId);
                            }
                        }
                        catch (Exception exe)
                        {
                            postingEnv.AddMessage(exe.Message);

                            Error(exe, trade);
                        }
                    }
                }

                // Credit || DEBIT Entries
                //interest payments, dividends etc
                var debitCover = tradeData.Where(i => i.TradeDate.Equals(valueDate) && (i.IsDebit() || i.IsCredit())).ToList();
                postingEnv.CallBack?.Invoke($"Processing DEBIT|CREDIT {debitCover.Count()} {label}");
                foreach (var trade in debitCover)
                {
                    // We only process trades that have not broken
                    if (ignoreTrades.Contains(trade.LpOrderId))
                        continue;
                    try
                    {
                        var processed = new Posting().ProcessTradeEvent(postingEnv, trade);
                        if (!processed)
                        {
                            // Lets add to the ignore list
                            ignoreTrades.Add(trade.LpOrderId);
                        }
                    }
                    catch (Exception exe)
                    {
                        postingEnv.AddMessage(exe.Message);

                        Error(exe, trade);
                    }
                }

                // Do Settlement and Daily Events here
                // daily event for generating unrealized pnl.
                // settlement date reverses trade date entries.
                postingEnv.CallBack?.Invoke($"Processing For Daily {tradeData.Count()} {label}");
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

                // Cash Settlement amounts
                if (postingEnv.Journals.Count() > 0)
                {
                    //PostingEngineCallBack?.Invoke($"Committing all Journal Entries {postingEnv.Journals.Count()} Entries");

                    postingEnv.CollectData(postingEnv.Journals);

                    postingEnv.Journals.Clear();
                }



                if (!journalsOnly)
                {
                    //postingEnv.CallBack?.Invoke($"Processing Dividends :: {valueDate.ToString("MM-dd-yyyy")}");
                    var dividends = CorporateActions.Dividends.Get(postingEnv);
                    var journals = dividends.Process();
                    postingEnv.CollectData(journals);
                    //postingEnv.CallBack?.Invoke($"Processed Dividends :: {valueDate.ToString("MM-dd-yyyy")}");
                }
                sw.Stop();
                postingEnv.CallBack?.Invoke($"Completed {label}::{tradeData.Count()} :: {valueDate.ToString("MM-dd-yyyy")} in {sw.ElapsedMilliseconds} ms", totalDays, daysProcessed++);

                valueDate = valueDate.AddDays(1);
            }

            if (postingEnv.TaxLotStatus.Count() > 0 && !journalsOnly)
            {
                postingEnv.CallBack?.Invoke($"Commiting Tax Lots for {valueDate.ToString("MM-dd-yyyy")}");

                new SQLBulkHelper().Insert("tax_lot_status", postingEnv.TaxLotStatus.Values.ToArray(), connection, transaction);

                postingEnv.CallBack?.Invoke($"Committed Tax Lots for {valueDate.ToString("MM-dd-yyyy")}");

                // Do not want them to be double posted
                postingEnv.TaxLotStatus.Clear();
            }

            if (postingEnv.Journals.Count() > 0)
            {
                postingEnv.CallBack?.Invoke($"Committing all Journal Entries {postingEnv.Journals.Count()} Entries");

                postingEnv.CollectData(postingEnv.Journals);

                postingEnv.Journals.Clear();
            }

            postingEnv.CallBack?.Invoke($"Processed # {label}::{postingEnv.Trades.Count()} transactions on " + DateTime.Now);
            new JournalLog()
            {
                Key = Key, RunDate = postingEnv.RunDate,
                Action = $"Processed # {label}::{postingEnv.Trades.Count()} transactions", ActionOn = DateTime.Now
            }.Save(connection, transaction);


            return postingEnv.Trades.Count();
        }

        /// <summary>
        /// Cleanup, This will be driven by the UI
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="period">Period with which to run with</param>
        private static bool Cleanup(SqlConnection connection, string period)
        {
            var process = new CleanupTask();
            var result = process.Run(new PostingEngineEnvironment
            {
                ConnectionString = connectionString,
                Period = period,
                CallBack = PostingEngineEx.LogProcess
            });

            return result;
        }

        private static void Error(Exception ex, Transaction element)
        {
        }

        private static async Task<List<T>> GetData<T>(string connectionString, string query)
        {
            var tradeApi = new TradeApi();
            var result = await Task.Run(() => tradeApi.All<T>(connectionString, query));
            return result;
        }

        private static async Task<string> GetTransactions(string webURI)
        {
            Task<string> result = null;

            var client = new HttpClient();

            var response = await client.GetAsync(webURI);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }
    }

    public class Posting
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public IPostingRule GetRule(PostingEngineEnvironment env, Transaction element)
        {
            return env.Rules.Where(i => i.Key.Equals(element.SecurityType)).FirstOrDefault().Value;
        }

        public bool ProcessTradeEvent(PostingEngineEnvironment env, Transaction element)
        {
            // Identify which entries to skip
            if (element.Status.Equals("Cancelled"))
            {
                env.AddMessage($"Trade has been cancelled || expired {element.LpOrderId} -- {element.Status}");
                // TODO: if there is already a Journal entry for this trade we need to back out the entries
                return false;
            }

            // Find me the rule
            var rule = env.Rules.Where(i => i.Key.Equals(element.SecurityType)).FirstOrDefault().Value;
            if (rule == null)
            {
                env.AddMessage($"No rule associated with {element.SecurityType}");
                return false;
            }

            if (!rule.IsValid(env, element))
            {
                // Defer message to the rule
                //env.AddMessage($"trade not valid to process {element.LpOrderId} -- {element.SecurityType}");
                //return false;
            }

            if (env.ValueDate == element.TradeDate.Date)
            {
                try
                {
                    rule.TradeDateEvent(env, element);
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, $"Unable to process the Event for Trade Date {ex.Message}");
                    env.AddMessage($"Unable to process the Event for Trade Date {ex.Message}");
                }
            }
            else
            {
                env.AddMessage($"Unable to process this trade TradeDate does not match ValueDate");
            }

            return true;
        }

        /// <summary>
        /// Based on the environment we need to determine what to do.
        /// </summary>
        /// <param name="env">The Posting Environment</param>
        /// <param name="element">The Trade to process</param>
        public bool Process(PostingEngineEnvironment env, Transaction element)
        {
            // Identify which entries to skip
            if ( element.Status.Equals("Cancelled"))
            {
                env.AddMessage($"Trade has been cancelled {element.LpOrderId} -- {element.Status}");
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
            var rule = env.Rules.Where(i => i.Key.Equals(element.SecurityType)).FirstOrDefault().Value;
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

            if (env.ValueDate == element.SettleDate.Date)
            {
                try
                {
                    rule.DailyEvent(env, element);
                    rule.SettlementDateEvent(env, element);
                }
                catch (Exception ex)
                {
                    var message = $"Daily/Settlement Event Failed for {element.Symbol}::{element.SecurityType}::{element.Side}::{ex.Message}";
                    Logger.Debug(ex, message);
                    env.AddMessage(message);
                }
            }
            else if (env.ValueDate >= element.TradeDate.Date)
            {
                try
                {
                    rule.DailyEvent(env, element);
                }
                catch (Exception ex)
                {
                    Logger.Debug(ex, $"Daily Event Failed for {element.Symbol}::{element.Side}::{ex.Message}");
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