using PostingEngine.MarketData;
using PostingEngine.Reports;
using System;

namespace PostingEngine
{
    public class PostingEngineEx
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Run the posting engine, being passed a period, and also a date
        /// </summary>
        /// <param name="valueDate">End date</param>
        /// <param name="period">Period back, i.e. Date - period</param>
        public void RunForPeriod(DateTime valueDate, string period)
        {
            var key = Guid.NewGuid();

            PullFromLegacySystem(key, valueDate);

            FxRates.CacheData();
            MarketPrices.CacheData();

            // Get all Activity
            RunForPeriod(key, valueDate, period);

            // Then Cost Basis
            CostBasisAndDayPnl(key, valueDate);

            // Unofficial Daily Pnl
            SettledCashBalances(key, valueDate);

            // Expences / Revenue
            ExpencesAndRevenues(key, valueDate);

            EndOfYear(key, valueDate);

            //GenerateEODReports();
            Complete(key, valueDate);
        }

        internal static void PullFromLegacySystem(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("PullFromBookmon", valueDate, key, LogProcess);
        }

        internal static void ExpencesAndRevenues(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("ExpencesAndRevenues", valueDate, key, LogProcess);
        }

        private static void LogProcess(string message, int totalRows, int rowsDone)
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

        internal static void EndOfYear(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("EndOfYear", valueDate, key, LogProcess);
        }

        internal static void Complete(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("Complete", valueDate, key, LogProcess);
        }

        internal static void SettledCashBalances(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("SettledCashBalances", valueDate, key, LogProcess);
        }

        internal static void RunForPeriod(Guid key, DateTime businesssdate, string period)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunForPeriod(period, key, businesssdate, LogProcess);
        }

        internal static void NonDesructive(Guid key, DateTime businesssdate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.NonDesructive("ITD", key, businesssdate, LogProcess);
        }

        internal static void CostBasisAndDayPnl(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("CostBasisAndDayPnl", valueDate, key, LogProcess);
        }

        internal static void CostBasis(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("CostBasis", valueDate, key, LogProcess);
        }

        internal static void CalculateDailyPnl(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("DailyPnl", valueDate, key, LogProcess);
        }

        static void GenerateEODReports()
        {
            EODReports reports = new EODReports();
            reports.TaxLotReport();
        }
    }
}
