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
        private static string Period { get; set; }
        private static int TotalRows { get; set; }
        private static int RowsDone { get; set; }
        // private static List<string> listMessage; //= new List<string>();

        private static Dictionary<Guid, List<string>> dict_Messages =
                     new Dictionary<Guid, List<string>>();



        public object StartPostingEngine(string period)
        {
            if (!IsRunning)
            {
                TotalRows = 0;
                RowsDone = 0; 
                Period = period;
                // listMessage = new List<string>();
                dict_Messages = new Dictionary<Guid, List<string>>();
                IsRunning = true;
                Key = Guid.NewGuid();
                PostingEngine.PostingEngineCallBack callback = MessageCallBack;

                Task.Run(() => PostingEngine.PostingEngine.Start(period, Key, callback))
                    .ContinueWith(task => { IsRunning = false;// dict_Messages[Key].Clear(); Key = Guid.Empty; 
                    });  

                return new
                {
                    Period = period,
                    Started = DateTime.Now,
                    key = Key,
                    IsRunning 
                };
            }

            return new
            {
                Period = period,
                Started = DateTime.Now,
                key = Key,
                IsRunning = false
            };

            //return Utils.Wrap(false, "Posting Engine is Already Running!");
        }

        public void MessageCallBack(string result, int totalRows = 0 , int rowsDone = 0)
        {
            if (totalRows >0)
            {
                TotalRows = totalRows;
                RowsDone = rowsDone;
                return;
            }

           if( dict_Messages.ContainsKey(Key))
            {

                dict_Messages[Key].Add(result);
            }
           else
            {
                List<string> listMessage = new List<string>();
                listMessage.Add(result);
                dict_Messages.Add(Key, listMessage); 
            }
            // listMessage.Add(result);
           // Console.WriteLine(result);
        }

        public object GetStatus(string key)
        {

            return new
            {
                message = dict_Messages.ContainsKey(Key) ? dict_Messages[Guid.Parse(key)] : new List<string>(),  //listMessage,
                Version = "Version 1.0",
                Key = key,
                Status = IsRunning,
                progress = TotalRows>0? RowsDone * 100/ TotalRows: 0 
            };
        }
        public object IsPostingEngineRunning()
        {
            return new
            {
                Period = Period,
                Started = DateTime.Now,
                key = Key,
                IsRunning  
            };
        }

        public static bool IsPostingEngineRunning()
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