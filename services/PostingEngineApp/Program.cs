using LP.Finance.Common;
using PostingEngine;
using System;
using System.Configuration;

namespace PostingEngineCmd
{
    class Program
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Args are as follows
        /// period=ITD | MTD | QTD or number of days i.e. 1D, 300D
        /// valuedate=YYYY-MM-DD
        /// </summary>
        /// <param name="args">List of the arguments we can pass to the Process</param>
        static void Main(string[] args)
        {
            // Defaults if no arguments passed
            var date = DateTime.Now.Date.PrevBusinessDate();
            var period = "ITD";

            if (args.Length > 0)
            {
                Logger.Info($"Args {string.Join(" , ", args)}");
            }

            if ( args.Length > 0)
            {
                date = DateTime.Parse(args[0]);
            }

            if (args.Length > 1)
            {
                period = args[1];
            }

            var dbEngine = ConfigurationManager.ConnectionStrings["FinanceDB"];
            Logger.Info($"Running Posting Engine for Period {period} and ValueDate {date:yyyy-MM-dd}");
            Logger.Info($"Using Database {dbEngine}");

            new PostingEngineEx().RunForPeriod(date, period);

            //new PostingEngineEx().RunSettledCashBalances(date, period);

            //PostingEngine.PostingEngine.RunCalculation("HistoricPerformance", period, date, Guid.NewGuid(), LogProcess);

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


        static void SingleTrade()
        {
            var key = System.Guid.NewGuid();

            // This runs thru everything, we need more or a scalpable
            PostingEngine.PostingEngine.StartSingleTrade("2cf1adb8-7983-45a6-874a-5131d7f13822", key, (message, totalRows, rowsDone) => {
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

    }
}
