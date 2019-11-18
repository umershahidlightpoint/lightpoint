using LP.Finance.Common;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine;
using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PostingEngineCmd
{
    class Program
    {
        static void Main(string[] args)
        {
            // Generate Journals First
            // Doing this for the previous Business Date
            var date = System.DateTime.Now.Date;
            date = date.PrevBusinessDate();

            //ITD(date);

            // Then Cost Basis
            //CostBasis();

            // Pull from BookMon
            //PullFromBookmon();

            // Settled Cash
            //CalculateDailyPnl();

            // Unofficial Daily Pnl
            SettledCashBalances();
        }

        static void PullFromBookmon()
        {
            var key = System.Guid.NewGuid();

            // This runs thru everything, we need more or a scalpable
            PostingEngine.PostingEngine.RunCalculation("PullFromBookmon", key, (message, totalRows, rowsDone) => {
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

        static void SettledCashBalances()
        {
            var key = System.Guid.NewGuid();

            // This runs thru everything, we need more or a scalpable
            PostingEngine.PostingEngine.RunCalculation("SettledCashBalances", key, (message, totalRows, rowsDone) => {
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

        static void ITD(DateTime businesssdate)
        {
            var key = System.Guid.NewGuid();

            // This runs thru everything, we need more or a scalpable
            PostingEngine.PostingEngine.Start("ITD", key, businesssdate, (message, totalRows, rowsDone) => {
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

        static void CostBasis()
        {
            var key = System.Guid.NewGuid();

            // This runs thru everything, we need more or a scalpable
            PostingEngine.PostingEngine.RunCalculation("CostBasis", key, (message, totalRows, rowsDone) => {
                if (message.StartsWith("Processing"))
                {
                    // Do nothing
                    return;
                }
                if (message.StartsWith("Completed"))
                {
                    var completed = (rowsDone * 1.0 / (totalRows != 0?totalRows: 1)) * 100;

                    Console.WriteLine($"{message}, % Completed {completed}");
                    return;
                }

                Console.WriteLine($"{message}");
            });

        }

        static void CalculateDailyPnl()
        {
            var key = System.Guid.NewGuid();

            // This runs thru everything, we need more or a scalpable
            PostingEngine.PostingEngine.RunCalculation("DailyPnl", key, (message, totalRows, rowsDone) => {
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
