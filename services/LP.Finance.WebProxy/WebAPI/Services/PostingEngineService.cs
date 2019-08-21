using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class PostingEngineService : IPostingEngineService
    {
        private static bool IsRunning { get; set; }
        private static Guid Key { get; set; }

        private static List<string> listMessage; 

       
        
        public object StartPostingEngine(string period)
        {

            if (!IsRunning)
            {
                
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
    }
}