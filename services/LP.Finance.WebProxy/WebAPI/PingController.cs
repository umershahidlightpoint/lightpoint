using System.Collections;
using System.Linq;
using System;
using System.Web.Http;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    public class PingController : ApiController
    {
        // GET api/hello
        public IEnumerable Get()
        {
            return new string[] { "Ping", "Version 1.0", "Finance WebProxy" };
        }
    }
}