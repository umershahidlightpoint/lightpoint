using LP.Finance.Common;
using LP.Finance.Common.Calculators;
using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine.Contracts;
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
        private static string clientName = ConfigurationManager.AppSettings["Client"].ToString();

        private static string Period;
        private static Guid Key;
        private static PostingEngineCallBack PostingEngineCallBack;

        public static void Complete()
        {
            PostingEngineCallBack?.Invoke("Completing Started");

            var dataTable = new SqlHelper(connectionString).GetDataTables("CacheResults", CommandType.StoredProcedure);

            PostingEngineCallBack?.Invoke("Finished");
        }

        public static void SettledCashBalances()
        {
            //DeleteJournals("settled-cash-fx");

            var dates = "select minDate = min([when]), maxDate = max([when]) from Journal";

            /* var sql = $@"WITH          
someData (Symbol, fx_currency, source, fund, balance, security_id) AS (          

select Symbol, fx_currency, source, fund, sum((credit- debit)/coalesce(fxrate,1)) as balance, security_id from vwJournal 
                        where AccountType = 'Settled Cash' and event = 'settlement'
                        and [when] < @busDate
                        and [event] not in ('journal')
						and fx_currency not in ('USD')
                        group by Symbol, fx_currency, source, fund, security_id 

)
select s.*, p.Quantity from vwPositions p
inner join someData s on s.security_id = p.SecurityId
where business_date = @busDate";
*/

            var sql = $@"select Symbol, fx_currency, source, fund, sum((credit- debit)/coalesce(fxrate,1)) as balance, security_id from vwJournal 
                        where AccountType = 'Settled Cash' and event = 'settlement'
                        and [when] < @busDate
                        and [event] not in ('journal')
						and fx_currency not in ('USD')
                        group by Symbol, fx_currency, source, fund, security_id";

            PostingEngineCallBack?.Invoke("SettledCash Calculation Started");

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SetupEnvironment.Setup(connection);

                var transaction = connection.BeginTransaction();

                var env = new PostingEngineEnvironment(connection, transaction)
                {
                    BaseCurrency = "USD",
                    SecurityDetails = new SecurityDetails().Get(),
                    RunDate = DateTime.Now.Date,
                    ConnectionString = connectionString
                };

                var table = new DataTable();

                // read the table structure from the database
                using (var adapter = new SqlDataAdapter(dates, new SqlConnection(connectionString)))
                {
                    adapter.Fill(table);
                };

                var valueDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
                var endDate = Convert.ToDateTime(table.Rows[0]["maxDate"]);

                var rowsCompleted = 1;
                var numberOfDays = (endDate - valueDate).Days;
                while (valueDate <= endDate)
                {
                    if (!valueDate.IsBusinessDate())
                    {
                        valueDate = valueDate.AddDays(1);
                        continue;
                    }
                    env.ValueDate = valueDate;
                    env.PreviousValueDate = valueDate.PrevBusinessDate();

                    try
                    {
                        var sqlParams = new SqlParameter[]
                        {
                            new SqlParameter("busDate", valueDate),
                        };

                        var con = new SqlConnection(connectionString);
                        con.Open();
                        var command = new SqlCommand(sql, con);
                        //command.Transaction = transaction;
                        command.Parameters.AddRange(sqlParams);
                        var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                        while (reader.Read())
                        {
                            var settledCash = new
                            {
                                Symbol = reader.GetFieldValue<string>(0),
                                Currency = reader.GetFieldValue<string>(1),
                                Source = reader.GetFieldValue<string>(2),
                                Fund = reader.GetFieldValue<string>(3),
                                Balance = reader.GetFieldValue<decimal>(4),
                                SecurityId = reader.GetFieldValue<int>(5),
                                //Quantity = reader.GetFieldValue <decimal>(6)
                            };

                            if (settledCash.Currency.Equals(env.BaseCurrency))
                                continue;

                            // Now Generate the correct set of entries

                            if ( settledCash.Symbol.Equals("RBD"))
                            {

                            }

                            //if (settledCash.Quantity == 0)
                            //    continue;

                            var prevFx = Convert.ToDouble(FxRates.Find(env.PreviousValueDate, settledCash.Currency).Rate);
                            var eodFx = Convert.ToDouble(FxRates.Find(env.ValueDate, settledCash.Currency).Rate);

                            var local = Convert.ToDouble(settledCash.Balance);

                            var changeDelta = eodFx - prevFx;
                            var change = changeDelta * local * -1;

                            var fromTo = new AccountUtils().GetAccounts(env, "Settled Cash", "fx gain or loss on settled balance", new string[] { settledCash.Currency }.ToList());

                            var debit = new Journal(fromTo.From, "settled-cash-fx", valueDate)
                            {
                                Source = settledCash.Source,
                                Fund = settledCash.Fund,
                                Quantity = local,

                                FxCurrency = settledCash.Currency,
                                Symbol = settledCash.Symbol,
                                SecurityId = settledCash.SecurityId,
                                FxRate = changeDelta,
                                StartPrice = prevFx,
                                EndPrice = eodFx,

                                Value = env.SignedValue(fromTo.From, fromTo.To, true, change),
                                CreditDebit = env.DebitOrCredit(fromTo.From, change),
                            };

                            var credit = new Journal(fromTo.To, "settled-cash-fx", valueDate)
                            {
                                Source = settledCash.Source,
                                Fund = settledCash.Fund,
                                Quantity = local,

                                FxCurrency = settledCash.Currency,
                                Symbol = settledCash.Symbol,
                                SecurityId = settledCash.SecurityId,
                                FxRate = changeDelta,
                                StartPrice = prevFx,
                                EndPrice = eodFx,

                                Value = env.SignedValue(fromTo.From, fromTo.To, false, change),
                                CreditDebit = env.DebitOrCredit(fromTo.To, change),
                            };

                            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
                        }
                        reader.Close();
                        con.Close();
                    }
                    catch (Exception ex)
                    {
                        PostingEngineCallBack?.Invoke($"Exception on {valueDate.ToString("MM-dd-yyyy")}, {ex.Message}");
                    }

                    PostingEngineCallBack?.Invoke($"Complete SettledCashBalances for {valueDate.ToString("MM-dd-yyyy")}", numberOfDays, rowsCompleted++);
                    valueDate = valueDate.AddDays(1);
                }

                // Now lets save the journals
                if (env.Journals.Count() > 0)
                {
                    env.CollectData(env.Journals);
                }

                transaction.Commit();
                connection.Close();
            }
        }

        public static void RunCalculation(string calculation, DateTime valueDate, Guid key, PostingEngineCallBack postingEngineCallBack)
        {
            var env = new PostingEngineEnvironment()
            {
                ConnectionString = connectionString,
                CallBack = postingEngineCallBack,
                BaseCurrency = "USD"
            };

            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            // Driven by calculation

            if (calculation.Equals("CostBasisAndDayPnl"))
            {
                var taskList = new List<Task<bool>>();

                var calc = PostingTasks.Get("costbasis");
                taskList.Add(PostingTasks.RunTask(env, calc));

                calc = PostingTasks.Get("dailypnl");
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
            else if ( calculation.Equals("SettledCashBalances"))
            {
                Logger.Info("Running SettledCashBalances");
                SettledCashBalances();
            }
            else if ( calculation.Equals("ExpencesAndRevenues"))
            {
                Logger.Info("Running ExpencesAndRevenues");
                var calc = PostingTasks.Get("expencesandrevenues");

                var result = PostingTasks.RunTask(env, calc);
                result.Wait();
            }
            else if (calculation.Equals("Complete"))
            {
                Logger.Info("Completing PostingEngine");
                Complete();
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
        public static void Start(string period, Guid key, DateTime businessDate, PostingEngineCallBack postingEngineCallBack)
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

                // Defer to the this Factory to determine how the trade list is mutated, if the client is not recognized then
                // we use the default Specification for the trade List.
                var finalTradeList = ClientSpecifics.ClientSpecificsFactory.Get(clientName).Transform(localTradeList);

                var accrualList = JsonConvert.DeserializeObject<Wrap<Accrual>>(accruals.Result).Data;
                PostingEngineCallBack?.Invoke("Retrieved All Data");

                if (String.IsNullOrEmpty(taxLotMethodology))
                    taxLotMethodology = "FIFO";

                PostingEngineCallBack?.Invoke($"Using {taxLotMethodology} Tax Methodology");

                var transaction = connection.BeginTransaction();

                var tradingPostingEnv = CreateTradingEnvironment(businessDate, period, connection, transaction);
                tradingPostingEnv.Allocations = allocationList;
                tradingPostingEnv.Trades = finalTradeList;
                tradingPostingEnv.Accruals = accrualList.ToDictionary(i => i.AccrualId, i => i);

                PostingEngineCallBack?.Invoke($"Starting Batch Posting Engine -- Trades on {DateTime.Now}");

                new JournalLog()
                {
                    Key = Key, RunDate = tradingPostingEnv.RunDate, Action = "Starting Batch Posting Engine -- Trades",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);


                // Run the trades pass next
                // Lets do Trading Activity, so no Journals
                sw.Reset();

                tradingPostingEnv.Completed = false;


                

                // Lets process the saving of the journals in the background
                HandleJournals(tradingPostingEnv);

                // differentiating between trades and journals. Moving forward we can create journal entries per symbol in a parallel fashion.
                PostingEngineCallBack?.Invoke($"Processing Trades on {DateTime.Now}");
                tradingPostingEnv.SkipWeekends = true;
                tradingPostingEnv.Rules = tradingPostingEnv.TradingRules;
                tradingPostingEnv.Trades = finalTradeList.Where(i => !i.SecurityType.Equals("Journals")).ToArray();
                tradingPostingEnv.CallBack = postingEngineCallBack;
                sw.Start();
                int count = RunAsync(connection, transaction, tradingPostingEnv, false).GetAwaiter().GetResult();
                sw.Stop();
                new JournalLog()
                {
                    Key = Key,
                    RunDate = tradingPostingEnv.RunDate,
                    Action = $"Completed Trade Processing {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds / 1000} s",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);

                // Lets do the Journal Activity and only Journals
                // zz_ journal entries from legacy system. just create double entry in portfolio accounting for each journal entry in the legacy system.
                PostingEngineCallBack?.Invoke($"Processing Journals on {DateTime.Now}");
                tradingPostingEnv.SkipWeekends = false;
                tradingPostingEnv.Rules = tradingPostingEnv.JournalRules;
                tradingPostingEnv.Trades = finalTradeList.Where(i => i.SecurityType.Equals("Journals")).ToArray();
                tradingPostingEnv.CallBack = postingEngineCallBack;

                sw.Start();
                count = count + RunAsync(connection, transaction, tradingPostingEnv, true).GetAwaiter().GetResult();
                sw.Stop();

                new JournalLog()
                {
                    Key = Key,
                    RunDate = tradingPostingEnv.RunDate,
                    Action = $"Completed Journal Processing {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds / 1000} s",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);

                Task<int> asyncResults = null;

                if (tradingPostingEnv.Journals.Count() > 0)
                {
                    asyncResults = Task.Run(() => tradingPostingEnv.CollectData(tradingPostingEnv.Journals));
                }

                var journalLogs = new List<JournalLog>();

                // Save the messages accumulated during the Run
                foreach (var message in tradingPostingEnv.Messages)
                {
                    journalLogs.Add(new JournalLog()
                    {
                        Key = Key, RunDate = tradingPostingEnv.RunDate,
                        Action = $" Error : {message.Key}, Count : {message.Value}", ActionOn = DateTime.Now
                    });
                }

                new SQLBulkHelper().Insert("journal_log", journalLogs.ToArray(), connection, transaction);

                new JournalLog()
                {
                    Key = Key, RunDate = tradingPostingEnv.RunDate,
                    Action =
                        $"Completed Batch Posting Engine {sw.ElapsedMilliseconds} ms / {sw.ElapsedMilliseconds / 1000} s",
                    ActionOn = DateTime.Now
                }.Save(connection, transaction);

                if ( asyncResults != null )
                    asyncResults.Wait();

                transaction.Commit();
                postingEngineCallBack?.Invoke("Posting Engine Processing Completed");

                tradingPostingEnv.Completed = true;
            }
        }

        private static PostingEngineEnvironment CreateTradingEnvironment(DateTime businessDate, String period, SqlConnection connection, SqlTransaction transaction)
        {
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
                const bool DEBUG = false;
                if (DEBUG)
                {
                    var symbols = new List<string> {
                    "IMKTA",
                    };


                    var types = new List<string> {
                    "Common Stock",
                    };

                    finalTradeList = finalTradeList.Where(t => symbols.Contains(t.Symbol)).ToArray();
                }

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

                postingEnv.Completed = false;


                PostingEngineCallBack?.Invoke($"Processing Trades on {DateTime.Now}");

                // Lets process the saving of the journals in the background
                HandleJournals(postingEnv);

                // differentiating between trades and journals. Moving forward we can create journal entries per symbol in a parallel fashion.
                postingEnv.SkipWeekends = true;
                postingEnv.Rules = postingEnv.TradingRules;
                postingEnv.Trades = finalTradeList.Where(i => !i.SecurityType.Equals("Journals")).ToArray();
                postingEnv.CallBack = postingEngineCallBack;
                int count = RunAsync(connection, transaction, postingEnv).GetAwaiter().GetResult();
                sw.Stop();

                // Lets do the Journal Activity and only Journals
                // zz_ journal entries from legacy system. just create double entry in portfolio accounting for each journal entry in the legacy system.
                PostingEngineCallBack?.Invoke($"Processing Journals on {DateTime.Now}");
                sw.Start();
                postingEnv.SkipWeekends = false;
                postingEnv.Rules = postingEnv.JournalRules;
                postingEnv.Trades = finalTradeList.Where(i => i.SecurityType.Equals("Journals")).ToArray();
                postingEnv.CallBack = postingEngineCallBack;
                count = count + RunAsync(connection, transaction, postingEnv).GetAwaiter().GetResult();
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

                postingEnv.Completed = true;
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

        static ObservableCollection<List<Journal>> Journals = new ObservableCollection<List<Journal>>();

        static PostingEngineEnvironment _postingEnv = null;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="env"></param>
        static void HandleJournals(PostingEngineEnvironment env)
        {
            _postingEnv = env;
            Journals.CollectionChanged += CollectionChanged;
        }

        private static SqlConnection __connection;

        private static int CollectData(string connectionString, List<Journal> journals)
        {
            if (__connection == null)
            {
                __connection = new SqlConnection(connectionString);
                __connection.Open();
            }

            var transaction = __connection.BeginTransaction();

            //Logger.Info($"Commiting Journals to the database {journals.Count()}");

            new SQLBulkHelper().Insert("journal", journals.ToArray(), __connection, transaction);

            //Logger.Info($"Completed :: Commiting Journals to the database {journals.Count()}");

            transaction.Commit();

            return journals.Count();
        }

        private static int CollectData(PostingEngineEnvironment env)
        {
            var connection = new SqlConnection(env.ConnectionString);
            connection.Open();
            var transaction = connection.BeginTransaction();

            while (true)
            {
                if (env.Completed)
                {
                    break;
                }

                if ( _journalQueue.Count() > 0)
                {
                    var journals = new List<Journal>();

                    while (_journalQueue.Count() > 0 )
                    {
                        var j = new List<Journal>();
                        var result = _journalQueue.TryDequeue(out j);

                        if ( result == false )
                        {
                            // What do we do ?
                        } else {
                            journals.AddRange(j.ToArray());
                        }
                    }
                    Logger.Info($"Commiting Journals to the database {journals.Count()}");

                    new SQLBulkHelper().Insert("journal", journals.ToArray(), connection, transaction);

                    Logger.Info($"Completed :: Commiting Journals to the database {journals.Count()}");
                }

                Thread.Sleep(1000);
            }

            if (_journalQueue.Count() > 0)
            {
                var journals = new List<Journal>();

                while (_journalQueue.Count() > 0)
                {
                    var j = new List<Journal>();
                    var result = _journalQueue.TryDequeue(out j);

                    if (result == false)
                    {
                        // What do we do ?
                    }
                    else
                    {
                        journals.AddRange(j.ToArray());
                    }
                }
                Logger.Info($"Final Commit Journals to the database {journals.Count()}");

                new SQLBulkHelper().Insert("journal", journals.ToArray(), connection, transaction);

                Logger.Info($"Completed :: Final Commit Journals to the database {journals.Count()}");
            }

            transaction.Commit();
            connection.Close();

            return 1;
        }

        static ConcurrentQueue<List<Journal>> _journalQueue = new ConcurrentQueue<List<Journal>>();

        private static void CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if ( e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
            {
                return;
            }

            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                var items = e.NewItems.Cast<List<Journal>>();

                foreach( var i in items)
                {
                    Journals.Remove(i);

                    var data = i.ToList();

                    Task.Run(() => _postingEnv.CollectData(data));
                }
            }
        }

        /// <summary>
        /// Process all activity
        /// </summary>
        /// <param name="connection">Database connection</param>
        /// <param name="transaction">Transaction</param>
        /// <param name="postingEnv">The posting environment</param>
        /// <returns></returns>
        static async Task<int> RunAsync(SqlConnection connection, SqlTransaction transaction, PostingEngineEnvironment postingEnv, bool journalsOnly = false)
        {
            if (postingEnv.Trades.Count() == 0)
                return 0;

            var minTradeDate = postingEnv.Trades.Min(i => i.TradeDate.Date);
            var maxTradeDate = postingEnv.Trades.Max(i => i.TradeDate.Date);
            var maxSettleDate = postingEnv.Trades.Max(i => i.SettleDate.Date);

            var valueDate = minTradeDate;
            var endDate = new DateTime(2019, 12,31);

            int totalDays = (int) (endDate - valueDate).TotalDays;
            int daysProcessed = 0;

            var ignoreTrades = new List<string>();

            Task<int> asyncResults = null;

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

                PostingEngineCallBack?.Invoke($"Processing {tradeData.Count()} Trades");

                //PostingEngineCallBack?.Invoke($"Sorted / Filtered Trades in {sw.ElapsedMilliseconds} ms");

                if (!journalsOnly)
                {
                    // BUY || SHORT trades
                    // creates tax lots
                    var buyShort = tradeData.Where(i => i.TradeDate.Equals(valueDate) && (i.IsBuy() || i.IsShort())).ToList();
                    PostingEngineCallBack?.Invoke($"Processing BUY|SHORT {buyShort.Count()} Trades");
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
                    PostingEngineCallBack?.Invoke($"Processing SELL|COVER {sellCover.Count()} Trades");
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
                PostingEngineCallBack?.Invoke($"Processing DEBIT|CREDIT {debitCover.Count()} Trades");
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
                PostingEngineCallBack?.Invoke($"Processing For Daily {tradeData.Count()} Trades");
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

                PostingEngineCallBack?.Invoke($"Finsihed Processing {tradeData.Count()}");

                // Cash Settlement amounts
                if (postingEnv.Journals.Count() > 0)
                {
                    PostingEngineCallBack?.Invoke($"Committing all Journal Entries {postingEnv.Journals.Count()} Entries");

                    postingEnv.CollectData(postingEnv.Journals);

                    postingEnv.Journals.Clear();
                }

                sw.Stop();

                PostingEngineCallBack?.Invoke($"Completed {valueDate.ToString("MM-dd-yyyy")} in {sw.ElapsedMilliseconds} ms", totalDays, daysProcessed++);


                valueDate = valueDate.AddDays(1);
            }

            if (postingEnv.TaxLotStatus.Count() > 0)
            {
                PostingEngineCallBack?.Invoke($"Commiting Tax Lots for {valueDate.ToString("MM-dd-yyyy")}");

                new SQLBulkHelper().Insert("tax_lot_status", postingEnv.TaxLotStatus.Values.ToArray(), connection, transaction);

                PostingEngineCallBack?.Invoke($"Committed Tax Lots for {valueDate.ToString("MM-dd-yyyy")}");

                // Do not want them to be double posted
                postingEnv.TaxLotStatus.Clear();
            }

            if (postingEnv.Journals.Count() > 0)
            {
                PostingEngineCallBack?.Invoke($"Committing all Journal Entries {postingEnv.Journals.Count()} Entries");

                postingEnv.CollectData(postingEnv.Journals);

                postingEnv.Journals.Clear();
            }

            PostingEngineCallBack?.Invoke($"Processed # {postingEnv.Trades.Count()} transactions on " + DateTime.Now);
            new JournalLog()
            {
                Key = Key, RunDate = postingEnv.RunDate,
                Action = $"Processed # {postingEnv.Trades.Count()} transactions", ActionOn = DateTime.Now
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

            try
            {
                // new SqlCommand("delete from ledger " + whereClause, connection).ExecuteNonQuery();
                var command = new SqlCommand("delete from journal " + whereClause, connection);
                command.CommandTimeout = 90;
                command.ExecuteNonQuery();

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
            catch ( Exception ex )
            {
                Logger.Debug(ex, "Unable to complete Cleanup");
                return false;
            }

            return true;
        }

        private static void Error(Exception ex, Transaction element)
        {
        }

        private static async Task<List<Transaction>> GetFromView(PostingEngineEnvironment env)
        {
            var dataTable  = new SqlHelper(env.ConnectionString).GetDataTable("vwCurrentStateTrades", CommandType.Text);
            return null;
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