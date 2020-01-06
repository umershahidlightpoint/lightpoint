using LP.Finance.Common;
using LP.Finance.Common.Calculators;
using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules;
using PostingEngine.PostingRules.Utilities;
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

        private static string Period;
        private static Guid Key;
        private static PostingEngineCallBack PostingEngineCallBack;

        public static void PullFromBookmon()
        {
            PostingEngineCallBack?.Invoke("Pull From BookMon Calculation Started");

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var sql = @"
                        declare @minDate as Date
                        declare @maxDate as Date

                        select @minDate = min(busDate), @maxDate = max(busDate) from PositionMaster..IntraDayPositionSplit

                        exec FundAccounting..PullDailyActivity @minDate, @maxDate
                        exec FundAccounting..PullDailyMarketPrices @minDate, @maxDate
                        exec FundAccounting..PullDailyFxPrices @minDate, @maxDate
                        ";
                var command = new SqlCommand(sql, connection);
                command.CommandTimeout = 120; // 2 Mins

                command.ExecuteNonQuery();
                connection.Close();
            }
        }

        public static void CalculateDailyPnl()
        {
            PostingEngineCallBack?.Invoke("Daily Pnl Calculation Started");

            using (var connection = new SqlConnection(connectionString))
            {
                //connection.Open();
                //var transaction = connection.BeginTransaction();

                PostingEngineCallBack?.Invoke("Getting Daily Pnl Data");

                var performanceRecords = DailyPnL.GetList(connectionString);

                var dailyPerformanceResult = new DailyPnlCalculator().CalculateDailyPerformance(performanceRecords);
                var dailyPerformance = dailyPerformanceResult.GetType().GetProperty("payload")
                    ?.GetValue(dailyPerformanceResult, null);
                bool insertDailyPnl = UpdateDailyPnl((List<DailyPnL>)dailyPerformance, connectionString);

                connection.Close();
                //transaction.Commit();
            }
        }

        private static bool UpdateDailyPnl(List<DailyPnL> records, string connectionString)
        {
            var query = $@"update unofficial_daily_pnl set 
                itd_pnl=@ITDPnL, 
                ytd_pnl=@YTDPnL, 
                qtd_pnl=@QTDPnL,
                mtd_pnl=@MTDPnL,
                last_updated_date = getDate(),
                last_updated_by = 'system',
                itd_percentage_return=@ITDPercentageReturn,
                qtd_percentage_return=@QTDPercentageReturn,
                ytd_percentage_return=@YTDPercentageReturn,
                mtd_percentage_return=@MTDPercentageReturn
                where id=@id";

            var connection = new SqlConnection(connectionString);
            connection.Open();
            var transaction = connection.BeginTransaction();
            foreach (var record in records)
            {
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("id", record.Id),

                    new SqlParameter("ITDPnL", record.ITDPnL),
                    new SqlParameter("YTDPnL", record.YTDPnL),
                    new SqlParameter("QTDPnL", record.QTDPnL),
                    new SqlParameter("MTDPnL", record.MTDPnL),

                    new SqlParameter("ITDPercentageReturn", record.ITDPercentageReturn),
                    new SqlParameter("YTDPercentageReturn", record.YTDPercentageReturn),
                    new SqlParameter("QTDPercentageReturn", record.QTDPercentageReturn),
                    new SqlParameter("MTDPercentageReturn", record.MTDPercentageReturn),
                };

                var command = new SqlCommand(query, connection);
                command.Transaction = transaction;
                command.Parameters.AddRange(sqlParams);
                command.ExecuteNonQuery();
            }
            transaction.Commit();
            connection.Close();

            return true;
        }

        public static void UnrealizedCashBalances(DateTime valueDate)
        {
            //DeleteJournals("unrealized-cash-fx");

            PostingEngineCallBack?.Invoke("UnrealizedCashBalances Calculation Started");

            var dates = "select minDate = min([when]), maxDate = max([when]) from Journal";
            var table = new DataTable();

            // read the table structure from the database
            using (var adapter = new SqlDataAdapter(dates, new SqlConnection(connectionString)))
            {
                adapter.Fill(table);
            };

            var startDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
            var endDate = Convert.ToDateTime(table.Rows[0]["maxDate"]);

            valueDate = startDate;

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                Setup(connection);

                //var transaction = connection.BeginTransaction();

                var env = new PostingEngineEnvironment(connection)
                {
                    ConnectionString = connectionString,
                    ValueDate = valueDate,
                    PreviousValueDate = valueDate.PrevBusinessDate(),
                    BaseCurrency = "USD",
                    SecurityDetails = new SecurityDetails().Get(),
                    Categories = AccountCategory.Categories,
                    Types = AccountType.All,
                    RunDate = System.DateTime.Now.Date,
                };

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

                    new FxPosting().CreateFxUnsettled(env);

                    PostingEngineCallBack?.Invoke($"Complete UnrealizedCashBalances for {valueDate.ToString("MM-dd-yyyy")}", numberOfDays, rowsCompleted++);

                    valueDate = valueDate.AddDays(1);
                }

                var transaction = connection.BeginTransaction();

                if (env.Journals.Count() > 0)
                {
                    CollectData(env, env.Journals);
                    //Journals.Add(env.Journals);
                }

                transaction.Commit();
                connection.Close();
            }

        }
        public static void ExpencesAndRevenues()
        {
            var dates = "select minDate = min([when]), maxDate = max([when]) from vwJournal";

            PostingEngineCallBack?.Invoke("ExpencesAndRevenues Calculation Started");

            var table = new DataTable();

            // read the table structure from the database
            using (var adapter = new SqlDataAdapter(dates, new SqlConnection(connectionString)))
            {
                adapter.Fill(table);
            };

            var valueDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
            var endDate = Convert.ToDateTime(table.Rows[0]["maxDate"]);

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                Setup(connection);

                connection.Close();
            }

            var rowsCompleted = 1;
            var numberOfDays = (endDate - valueDate).Days;
            while (valueDate <= endDate)
            {
                if (!valueDate.IsBusinessDate())
                {
                    valueDate = valueDate.AddDays(1);
                    continue;
                }

                try
                {
                    var sqlParams = new SqlParameter[]
                    {
                        new SqlParameter("@startDate", new DateTime(valueDate.Year, 1, 1)),
                        new SqlParameter("@businessDate", valueDate),
                        new SqlParameter("@prevbusinessDate", valueDate.PrevBusinessDate()),
                    };

                    var dataTable = new SqlHelper(connectionString).GetDataTables("DayOverDayIncome", CommandType.StoredProcedure, sqlParams.ToArray());

                    foreach( DataRow row in dataTable[0].Rows)
                    {
                        int offset = 0;
                        var expencesAndRevenues = new
                        {
                            Fund = Convert.ToString(row[offset++]),
                            Credit = Convert.ToDecimal(row[offset++]),
                            Debit = Convert.ToDecimal(row[offset++]),
                            Balance = Convert.ToDecimal(row[offset++]),
                        };

                        var year = valueDate.Year.ToString();
                        if (valueDate.Year == DateTime.Now.Year)
                            year = "Current Year";

                        var accountType = $"Net Income {year}";
                        if ( AccountType.Find(AccountCategory.AC_EQUITY, accountType, false) == null)
                        {
                            // Need to create the Account Type
                            var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_EQUITY, accountType);
                            createdAccountType.Save(connectionString);
                        }

                        var balance = Convert.ToDouble(expencesAndRevenues.Balance);

                        var connection = new SqlConnection(connectionString);
                        connection.Open();
                        var transaction = connection.BeginTransaction();

                        var env = new PostingEngineEnvironment(connection, transaction)
                        {
                            BaseCurrency = "USD",
                            SecurityDetails = new SecurityDetails().Get(),
                            Categories = AccountCategory.Categories,
                            Types = AccountType.All,
                            RunDate = DateTime.Now.Date,
                            ConnectionString = connectionString,
                        };

                        var account = new AccountUtils().GetAccount(env, accountType, new string[] { env.BaseCurrency}.ToList());

                        var debit = new Journal(account, "expences-revenues", valueDate)
                        {
                            Source = "",
                            Fund = expencesAndRevenues.Fund,
                            Quantity = balance,

                            FxCurrency = env.BaseCurrency,
                            Symbol = env.BaseCurrency,
                            SecurityId = -1,
                            FxRate = 0,
                            StartPrice = 0,
                            EndPrice = 0,

                            // If this number is +ve then its actually a Debit and this is going into a Equity account which needs to be -ve and not +ve
                            Value = balance * -1,
                            CreditDebit = env.DebitOrCredit(account, balance * -1),
                        };

                        env.Journals.AddRange(new List<Journal>(new[] { debit }));

                        if (env.Journals.Count() > 0)
                        {
                            CollectData(env, env.Journals);
                            env.Journals.Clear();
                        }

                        transaction.Commit();
                        connection.Close();
                    }
                }
                catch (Exception ex)
                {
                    PostingEngineCallBack?.Invoke($"Exception on {valueDate.ToString("MM-dd-yyyy")}, {ex.Message}");
                }

                PostingEngineCallBack?.Invoke($"Completed ExpencesAndRevenues for {valueDate.ToString("MM-dd-yyyy")}", numberOfDays, rowsCompleted++);
                valueDate = valueDate.AddDays(1);
            }
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

                Setup(connection);

                var transaction = connection.BeginTransaction();

                var env = new PostingEngineEnvironment(connection, transaction)
                {
                    BaseCurrency = "USD",
                    SecurityDetails = new SecurityDetails().Get(),
                    Categories = AccountCategory.Categories,
                    Types = AccountType.All,
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
                    CollectData(env, env.Journals);
                    //Journals.Add(env.Journals);
                }

                transaction.Commit();
                connection.Close();
            }
        }
        public static void CalculateCostBasis(PostingEngineCallBack postingEngineCallBack)
        {
            postingEngineCallBack?.Invoke("Cost Basis Calculation Started");

            var dates = "select minDate = min([when]), maxDate = max([when]) from Journal";
            var table = new DataTable();

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // read the table structure from the database
                using (var adapter = new SqlDataAdapter(dates, connection))
                {
                    adapter.Fill(table);
                };

                var valueDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
                //valueDate = new DateTime(2019, 1, 1);
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

                    try
                    {
                        var transaction = connection.BeginTransaction();
                        CostBasisDto.Calculate(connection, transaction, valueDate);
                        transaction.Commit();
                    }
                    catch ( Exception ex )
                    {
                        postingEngineCallBack?.Invoke($"Exception on {valueDate.ToString("MM-dd-yyyy")}, {ex.Message}");
                    }

                    postingEngineCallBack?.Invoke($"Completed CostBasis for {valueDate.ToString("MM-dd-yyyy")}", numberOfDays, rowsCompleted++);
                    valueDate = valueDate.AddDays(1);
                }

                connection.Close();
            }
        }

        public static void RunCalculation(string calculation, DateTime valueDate, Guid key, PostingEngineCallBack postingEngineCallBack)
        {
            Key = key;
            PostingEngineCallBack = postingEngineCallBack;

            // Driven by calculation

            if (calculation.Equals("CostBasis"))
            {
                Logger.Info("Running the Cost Basis Process");
                CalculateCostBasis(postingEngineCallBack);
            }
            else if (calculation.Equals("DailyPnl"))
            {
                CalculateDailyPnl();
            }
            else if (calculation.Equals("PullFromBookmon"))
            {
                Logger.Info("Pulling Data from Legacy System");
                try
                {
                    PullFromBookmon();
                } catch ( Exception ex )
                {
                    Logger.Debug(ex, "PullFromBookmon Failed");
                }
            }
            else if ( calculation.Equals("SettledCashBalances"))
            {
                Logger.Info("Running SettledCashBalances");
                SettledCashBalances();
            }
            else if (calculation.Equals("UnrealizedCashBalances"))
            {
                // Skip as this should be done in the Daily Event
                //UnrealizedCashBalances(valueDate);
            } else if ( calculation.Equals("ExpencesAndRevenues"))
            {
                Logger.Info("Running ExpencesAndRevenues");
                ExpencesAndRevenues();
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
                    Categories = AccountCategory.Categories,
                    Types = AccountType.All,
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
                    CollectData(postingEnv, postingEnv.Journals);
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
                Setup(connection);

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
                    var tags = new List<string> {
                    //"EURUSD", // CROSS
                    //"GBPUSD", // CROSS
                    //"GBP/USD 12/18/2019", // FPRWARD
                    //"HOME", "CHD", "STNG" // Test the latest for position
                    "FORWARD", "CROSS"
                    };

                    //finalTradeList = finalTradeList.Where(t => tags.Contains(t.Symbol)).ToArray();
                    finalTradeList = finalTradeList.Where(t => tags.Contains(t.SecurityType)).ToArray();
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
                    Categories = AccountCategory.Categories,
                    Types = AccountType.All,
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
                    Key = Key, RunDate = postingEnv.RunDate, Action = "Starting Batch Posting Engine -- Trades",
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
                    asyncResults = Task.Run(() => CollectData(postingEnv, postingEnv.Journals.ToArray()));

                    //CollectData(postingEnv, postingEnv.Journals);
                    //Journals.Add(postingEnv.Journals);
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

                if ( asyncResults != null )
                    asyncResults.Wait();

                transaction.Commit();
                postingEngineCallBack?.Invoke("Posting Engine Processing Completed");

                postingEnv.Completed = true;
            }
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
                Setup(connection);

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
                    "BYG LN",
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
                    Categories = AccountCategory.Categories,
                    Types = AccountType.All,
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
                    asyncResults = Task.Run(() => CollectData(postingEnv, postingEnv.Journals.ToArray()));

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
                    CollectData(postingEnv, postingEnv.Journals);
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

        private static int CollectData(PostingEngineEnvironment env, List<Journal> journals)
        {
            if (__connection == null )
            {
                __connection = new SqlConnection(env.ConnectionString);
                __connection.Open();
            }

            var transaction = __connection.BeginTransaction();

            Logger.Info($"Commiting Journals to the database {journals.Count()}");

            new SQLBulkHelper().Insert("journal", journals.ToArray(), __connection, transaction);

            Logger.Info($"Completed :: Commiting Journals to the database {journals.Count()}");

            transaction.Commit();

            return journals.Count();
        }

        private static int CollectData(PostingEngineEnvironment env, Journal[] journals)
        {
            return CollectData(env, journals.ToList());
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

                    Task.Run(() => CollectData(_postingEnv, data));
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
        static async Task<int> RunAsync(SqlConnection connection, SqlTransaction transaction, PostingEngineEnvironment postingEnv)
        {
            if (postingEnv.Trades.Count() == 0)
                return 0;

            var minTradeDate = postingEnv.Trades.Min(i => i.TradeDate.Date);
            var maxTradeDate = postingEnv.Trades.Max(i => i.TradeDate.Date);
            var maxSettleDate = postingEnv.Trades.Max(i => i.SettleDate.Date);

            var valueDate = minTradeDate;
            var endDate = maxTradeDate;
            if (maxSettleDate < DateTime.Now)
                endDate = maxSettleDate;

            //var endDate = postingEnv.BusinessDate;

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
                postingEnv.TaxRate = new TaxRates().Get(valueDate);
                postingEnv.GetUnsettledPnl();

                var tradeData = postingEnv.Trades.Where(i => i.TradeDate <= valueDate).OrderBy(i => i.TradeDate.Date).ToList();

                PostingEngineCallBack?.Invoke($"Processing {tradeData.Count()} Trades");

                //PostingEngineCallBack?.Invoke($"Sorted / Filtered Trades in {sw.ElapsedMilliseconds} ms");

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

                    //if (asyncResults != null)
                    //    asyncResults.Wait();

                    //asyncResults = Task.Run(() => CollectData(postingEnv, postingEnv.Journals.ToArray()));

                    CollectData(postingEnv, postingEnv.Journals);
                    //Journals.Add(postingEnv.Journals);

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

            PostingEngineCallBack?.Invoke($"Processed # {postingEnv.Trades.Count()} transactions on " + DateTime.Now);
            new JournalLog()
            {
                Key = Key, RunDate = postingEnv.RunDate,
                Action = $"Processed # {postingEnv.Trades.Count()} transactions", ActionOn = DateTime.Now
            }.Save(connection, transaction);


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
            if (element.Status.Equals("Cancelled") || element.Status.Equals("Expired"))
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
                return false;
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
                    rule.SettlementDateEvent(env, element);
                    rule.DailyEvent(env, element);
                }
                catch (Exception ex)
                {
                    Logger.Debug(ex, $"Settlement Event Failed for {element.Symbol}::{element.Side}::{ex.Message}");
                    env.AddMessage($"Unable to process the Event for Settlement Date {ex.Message}");
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