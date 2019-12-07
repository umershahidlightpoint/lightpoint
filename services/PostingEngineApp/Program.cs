using LP.Finance.Common;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine;
using PostingEngine.MarketData;
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

            new PostingEngineEx().Start(date);
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
