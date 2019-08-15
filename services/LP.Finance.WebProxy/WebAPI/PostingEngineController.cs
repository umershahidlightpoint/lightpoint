using System.Collections;
using System.Linq;
using System;
using System.Web.Http;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    public class PostingEngineController : ApiController
    {
        // GET api/hello
        public object Get(string period = "ITD")
        {
            return new
            {
                period = period,
                started = DateTime.Now,
                key = Guid.NewGuid().ToString()
            };
        }

        [Route("status/{key}")]
        [HttpGet]
        public object Status(string key)
        {
            return new string[] { "Ping", "Version 1.0", key };
        }

    }
}