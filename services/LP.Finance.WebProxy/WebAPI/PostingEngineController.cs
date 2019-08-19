using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    [RoutePrefix("api/postingEngine")]
    public class PostingEngineController : ApiController
    {
        public static bool IsRunning { get; set; }
        public static string Key { get; set; }

        // GET api/postingEngine
        [HttpGet]
        public object Get(string period = "ITD")
        {
            // High Level Implementation should be Refactored as much as Possible
            if (!IsRunning)
            {
                IsRunning = true;
                Key = Guid.NewGuid().ToString();

                Task.Run(() => PostingEngine.PostingEngine.Start(period)).ContinueWith(task => IsRunning = false);

                return new
                {
                    period,
                    started = DateTime.Now,
                    Key,
                    IsRunning
                };
            }

            return new
            {
                Key,
                IsRunning
            };
        }

        [Route("status/{key}")]
        [HttpGet]
        public object Status(string key)
        {
            // Should be Refactored to Return the Actual Posting Environment based on Key
            return new string[] {"Ping", "Version 1.0", key, IsRunning.ToString()};
        }
    }
}