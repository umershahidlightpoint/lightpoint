using PostingEngine.MarketData;
using System;

namespace PostingEngine
{
    public class PostingEngineEx
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public void Start(DateTime valueDate)
        {
            var key = Guid.NewGuid();

            PullFromLegacySystem(key, valueDate);

            Logger.Info("Caching FxRates");
            FxRates.CacheData();

            Logger.Info("Caching MarketPrices");
            MarketPrices.CacheData();

            // Get all Activity
            ITD(key, valueDate);

            // Then Cost Basis
            CostBasis(key, valueDate);

            // Settled Cash
            CalculateDailyPnl(key, valueDate);

            // Unofficial Daily Pnl
            SettledCashBalances(key, valueDate);

            // Mark to Market Cash Fx
            UnrealizedCashBalances(key, valueDate);

            // Expences / Revenue
            ExpencesAndRevenues(key, valueDate);

            //DerivativesContracts(key, valueDate);

            Complete(key, valueDate);
        }

        internal static void PullFromLegacySystem(Guid key, DateTime valueDate)
        {

            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("PullFromBookmon", valueDate, key, (message, totalRows, rowsDone) => {
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
            });
        }

        static void ExpencesAndRevenues(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("ExpencesAndRevenues", valueDate, key, (message, totalRows, rowsDone) => {
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
            });
        }

        static void DerivativesContracts(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("DerivativesContracts", valueDate, key, (message, totalRows, rowsDone) => {
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
            });
        }

        static void Complete(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("Complete", valueDate, key, (message, totalRows, rowsDone) => {
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
            });
        }

        static void UnrealizedCashBalances(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("UnrealizedCashBalances", valueDate, key, (message, totalRows, rowsDone) => {
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
            });
        }
        static void SettledCashBalances(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("SettledCashBalances", valueDate, key, (message, totalRows, rowsDone) => {
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
            });
        }
        static void ITD(Guid key, DateTime businesssdate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.Start("ITD", key, businesssdate, (message, totalRows, rowsDone) => {
                if (message.StartsWith("Processing"))
                {
                    Logger.Info($"{message}");
                    return;
                }
                if (message.StartsWith("Completed"))
                {
                    var completed = (rowsDone * 1.0 / totalRows) * 100;

                    Logger.Info($"{message}, %{completed}");
                    return;
                }

                Logger.Info($"{message}");
            });

        }

        static void NonDesructive(Guid key, DateTime businesssdate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.NonDesructive("ITD", key, businesssdate, (message, totalRows, rowsDone) => {
                if (message.StartsWith("Processing"))
                {
                    Logger.Info($"{message}");
                    return;
                }
                if (message.StartsWith("Completed"))
                {
                    var completed = (rowsDone * 1.0 / totalRows) * 100;

                    Logger.Info($"{message}, % Completed {completed}");
                    return;
                }

                Logger.Info($"{message}");
            });

        }

        static void CostBasis(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("CostBasis", valueDate, key, (message, totalRows, rowsDone) => {
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
            });

        }

        static void CalculateDailyPnl(Guid key, DateTime valueDate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.RunCalculation("DailyPnl", valueDate, key, (message, totalRows, rowsDone) => {
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
            });

        }
    }
}
