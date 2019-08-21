using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using LP.Finance.Common;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class PostingEngineService : IPostingEngineService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        private static bool IsRunning { get; set; }
        private static Guid Key { get; set; }
        private static List<string> listMessage = new List<string>();

        public object StartPostingEngine(string period)
        {
            if (!IsRunning)
            {
                listMessage.Clear();
                IsRunning = true;
                Key = Guid.NewGuid();
                PostingEngine.PostingEngineCallBack callback = MessageCallBack;

                Task.Run(() => PostingEngine.PostingEngine.Start(period, Key, callback))
                    .ContinueWith(task => IsRunning = false);

                return new
                {
                    Period = period,
                    Started = DateTime.Now,
                    Key,
                    IsRunning
                };
            }

            return Utils.Wrap(false, "Posting Engine is Already Running!");
        }

        public void MessageCallBack(string result)
        {
            listMessage.Add(result);
            Console.WriteLine(result);
        }

        public object GetStatus(string key)
        {
            return new
            {
                Message = PostingEngine.PostingEngine.ss,
                Version = "Version 1.0",
                Key = key,
                Status = IsRunning
            };
        }

        public bool IsPostingEngineRunning(string key)
        {
            return IsRunning;
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
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }
    }
}