using System;
using System.Threading.Tasks;
using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class PostingEngineService : IPostingEngineService
    {
        private static bool IsRunning { get; set; }
        private static string Key { get; set; }

        public object StartPostingEngine(string period)
        {
            if (!IsRunning)
            {
                IsRunning = true;
                Key = Guid.NewGuid().ToString();

                Task.Run(() => PostingEngine.PostingEngine.Start(period))
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

        public object GetStatus(string key)
        {
            return new
            {
                Message = "Ping",
                Version = "Version 1.0",
                Key = key,
                Status = IsRunning
            };
        }
    }
}