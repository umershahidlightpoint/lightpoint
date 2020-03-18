using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Threading.Tasks;
using LP.Finance.Common;
using PostingEngine;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class PostingEngineService : IPostingEngineService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        private static bool IsRunning { get; set; }
        private static Guid Key { get; set; }
        private static string Period { get; set; }
        private static string OrderId { get; set; }
        private static int TotalRecords { get; set; }
        private static int RecordsProcessed { get; set; }

        private static ConcurrentDictionary<Guid, List<string>> logMessages =
            new ConcurrentDictionary<Guid, List<string>>();

        public object StartPostingEngine(string period)
        {
            if (!IsRunning)
            {
                IsRunning = true;
                Key = Guid.NewGuid();
                TotalRecords = 0;
                RecordsProcessed = 0;
                Period = period;
                logMessages = new ConcurrentDictionary<Guid, List<string>>();

                Task.Run(() => new PostingEngineEx().RunForPeriod(period, Key, System.DateTime.Now.Date, LogMessagesCallBack))
                    .ContinueWith(task => { IsRunning = false; });

                return new
                {
                    Period = period,
                    Started = DateTime.Now,
                    key = Key,
                    IsRunning
                };
            }

            return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is Already Running!");
        }

        public object StartPostingEngineSingleOrder(string orderId)
        {
            if (!IsRunning)
            {
                IsRunning = true;
                Key = Guid.NewGuid();
                TotalRecords = 0;
                RecordsProcessed = 0;
                OrderId = orderId;
                logMessages = new ConcurrentDictionary<Guid, List<string>>();

                PostingEngine.PostingEngineCallBack logsCallback = LogMessagesCallBack;

                Task.Run(() => PostingEngine.PostingEngine.StartSingleTrade(orderId, Key, logsCallback))
                    .ContinueWith(task => { IsRunning = false; });

                return new
                {
                    OrderId = orderId,
                    Started = DateTime.Now,
                    key = Key,
                    IsRunning
                };
            }

            return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is Already Running!");
        }

        public void LogMessagesCallBack(string log, int totalRecords = 0, int recordsProcessed = 0)
        {
            if (totalRecords > 0)
            {
                TotalRecords = totalRecords;
                RecordsProcessed = recordsProcessed;
                return;
            }

            if (logMessages.ContainsKey(Key))
            {
                logMessages[Key].Add(log);
            }
            else
            {
                List<string> logMessage = new List<string> {log};
                logMessages.TryAdd(Key, logMessage);
            }
        }

        public object GetStatus(string key)
        {
            return new
            {
                message = logMessages.ContainsKey(Key)
                    ? logMessages[Guid.Parse(key)]
                    : new List<string>(),
                Version = "Version 1.0",
                Key = key,
                Status = IsRunning,
                progress = TotalRecords > 0 ? RecordsProcessed * 100 / TotalRecords : 0
            };
        }

        public object GetProgress()
        {
            return new
            {
                Period,
                Started = DateTime.Now,
                key = Key,
                IsRunning,
                progress = TotalRecords > 0 ? RecordsProcessed * 100 / TotalRecords : 0
            };
        }

        public object ClearJournals(string type)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();

                List<SqlParameter> journalParameters = new List<SqlParameter>
                {
                    new SqlParameter("system", "system"),
                    new SqlParameter("user", "user"),
                    new SqlParameter("type", type)
                };


                var journalQuery = $@"DELETE FROM [journal]
                                    WHERE [generated_by] = ";

                journalQuery += type == "both" ? "@system OR [generated_by] = @user" : "@type";

                sqlHelper.Delete(journalQuery, CommandType.Text, journalParameters.ToArray());

                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Exception: {ex}");
                return Shared.WebApi.Wrap(false);
            }

            return Shared.WebApi.Wrap(true);
        }
    }
}