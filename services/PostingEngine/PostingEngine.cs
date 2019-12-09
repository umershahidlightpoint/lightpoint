using PostingEngine.MarketData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine
{
    public class PostingEngineEx
    {
        public void Start(DateTime valueDate)
        {
            var key = System.Guid.NewGuid();

            PullFromLegacySystem(key, valueDate);

            FxRates.CacheData();
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

                    Console.WriteLine($"{message}, % Completed {completed}");
                    return;
                }

                Console.WriteLine($"{message}");
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

                    Console.WriteLine($"{message}, % Completed {completed}");
                    return;
                }

                Console.WriteLine($"{message}");
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

                    Console.WriteLine($"{message}, % Completed {completed}");
                    return;
                }

                Console.WriteLine($"{message}");
            });
        }
        static void ITD(Guid key, DateTime businesssdate)
        {
            // This runs thru everything, we need more or a scalpable
            PostingEngine.Start("ITD", key, businesssdate, (message, totalRows, rowsDone) => {
                if (message.StartsWith("Processing"))
                {
                    // Do nothing
                    return;
                }
                if (message.StartsWith("Completed"))
                {
                    var completed = (rowsDone * 1.0 / totalRows) * 100;

                    Console.WriteLine($"{message}, % Completed {completed}");
                    return;
                }

                Console.WriteLine($"{message}");
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

                    Console.WriteLine($"{message}, % Completed {completed}");
                    return;
                }

                Console.WriteLine($"{message}");
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

                    Console.WriteLine($"{message}, % Completed {completed}");
                    return;
                }

                Console.WriteLine($"{message}");
            });

        }
    }
}
