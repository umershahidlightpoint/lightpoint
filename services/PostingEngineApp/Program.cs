using LP.Finance.Common;
using PostingEngine;
using System;
using System.Configuration;
using System.Collections.Generic;
using System.CommandLine;
using System.CommandLine.Invocation;

namespace PostingEngineCmd
{
    class PostingEngineCommand
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public Option DateOption()
        {
            var option2 = new Option<DateTime>(
        "--date",
        getDefaultValue: () => System.DateTime.Now.PrevBusinessDate(),
        description: "Specify the Ending Date"

    );
            option2.AddAlias("--d");
            option2.AddAlias("-d");
            return option2;
        }
        public Option PeriodOption()
        {
            var option1 = new Option<string>(
                                "--period",
                                getDefaultValue: () => "ITD",
                                description: "Specify the Period"

                            );
            option1.AddAlias("--p");
            option1.AddAlias("-p");

            return option1;
        }

        public Command Build()
        {
            var cmd = new Command("run");
            cmd.Description = "Runs the posting Engine";

            cmd.Handler = CommandHandler.Create<DateTime, string>(async (date, period) =>
            {
                var dbEngine = ConfigurationManager.ConnectionStrings["FinanceDB"];
                Logger.Info($"Running Posting Engine for Period {period} and ValueDate {date:yyyy-MM-dd}");
                Logger.Info($"Using Database {dbEngine}");

                new PostingEngineEx().RunForPeriod(date, period);
            });

            cmd.AddOption(PeriodOption());
            cmd.AddOption(DateOption());

            return cmd;
        }

        public Command BuildAction()
        {
            var cmd = new Command("action");
            cmd.Description = "Runs a seperate calculation";

            cmd.Handler = CommandHandler.Create<string, string, DateTime>(async (name, period, date) =>
            {
                PostingEngine.PostingEngine.RunCalculation(name, period, date, Guid.NewGuid(), Program.LogProcess);
            });


            var option1 = new Option<string>(
                                "--name",
                                getDefaultValue: () => String.Empty,
                                description: "Action to be run"

                            );
            option1.AddAlias("--n");
            option1.AddAlias("-n");

            cmd.AddOption(option1);
            cmd.AddOption(PeriodOption());
            cmd.AddOption(DateOption());

            return cmd;
        }

    }
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
            var rootCommand = new RootCommand();

            rootCommand.Name = "PostingEngineApp";
            rootCommand.Description = "PostingEngine -- Runs the posting Engine from command line";

            rootCommand.Add(new PostingEngineCommand().Build());
            rootCommand.Add(new PostingEngineCommand().BuildAction());

            if (args.Length > 0)
                rootCommand.InvokeAsync(args).Wait();
            else
                Run();
        }

        private static void Run()
        {
            // Defaults if no arguments passed
            var date = DateTime.Now.Date.PrevBusinessDate();
            var period = "ITD";

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
