using PostingEngine.MarketData;
using PostingEngine.Reports;
using System;

namespace PostingEngine
{
    public class PostingEngineEx
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public void RunSettledCashBalances(DateTime valueDate, string period)
        {
            FxRates.CacheData();
            MarketPrices.CacheData();

            PostingEngine.RunAction("settledcashbalances", period, valueDate, Guid.NewGuid(), LogProcess);
            
        }
        public void RunForPeriod(string period, Guid key, DateTime valueDate, PostingEngineCallBack callback)
        {
            PostingEngine.RunCalculation("PullFromBookmon", period, valueDate, key, callback);

            FxRates.CacheData();
            MarketPrices.CacheData();

            // Get all Activity
            PostingEngine.RunForPeriod(period, key, valueDate, callback);

            // Expences / Revenue / Settled Cash Balances
            PostingEngine.RunCalculation("ExpencesAndRevenues", period, valueDate, key, callback);

            RunAction(key, "EndOfYear", valueDate, period, callback);

            //GenerateEODReports();
            RunAction(key, "CacheData", valueDate, period, callback);

            // Then Cost Basis
            PostingEngine.RunCalculation("CostBasisAndDayPnl", period, valueDate, key, callback);
        }

        /// <summary>
        /// Run the posting engine, being passed a period, and also a date
        /// </summary>
        /// <param name="valueDate">End date</param>
        /// <param name="period">Period back, i.e. Date - period</param>
        public void RunForPeriod(DateTime valueDate, string period)
        {
            var key = Guid.NewGuid();

            PostingEngine.RunCalculation("PullFromBookmon", period, valueDate, key, LogProcess);

            FxRates.CacheData();
            MarketPrices.CacheData();

            // Get all Activity
            PostingEngine.RunForPeriod(period, key, valueDate, LogProcess);

            // Expences / Revenue / Settled Cash Balances
            PostingEngine.RunCalculation("ExpencesAndRevenues", period, valueDate, key, LogProcess);

            RunAction(key, "EndOfYear", valueDate, period);

            //GenerateEODReports();
            RunAction(key, "CacheData", valueDate, period);

            // Then Cost Basis
            PostingEngine.RunCalculation("CostBasisAndDayPnl", period, valueDate, key, LogProcess);
        }

        internal static void LogProcess(string message, int totalRows, int rowsDone)
        {
            if (message.StartsWith("Processing"))
            {
                // Do nothing
                return;
            }
            if (message.StartsWith("Completed"))
            {
                var completed = (rowsDone * 1.0 / (totalRows != 0 ? totalRows : 1)) * 100;

                Logger.Info($"{message}, % Completed {completed}");
                return;
            }

            Logger.Info($"{message}");
        }

        internal static void RunAction(Guid key, string action, DateTime valueDate, string period, PostingEngineCallBack callback = null)
        {
            PostingEngine.RunCalculation(action, period, valueDate, key, callback != null ? callback : LogProcess);
        }

        internal static void NonDesructive(Guid key, DateTime businesssdate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.NonDesructive("ITD", key, businesssdate, LogProcess);
        }

        static void GenerateEODReports()
        {
            EODReports reports = new EODReports();
            reports.TaxLotReport();
        }
    }
}
