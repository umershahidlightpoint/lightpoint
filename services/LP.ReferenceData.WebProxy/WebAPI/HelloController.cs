using System.Collections;
using System.Linq;
using System;
using System.Web.Http;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    public class HelloController : ApiController
    {
        // GET api/hello
        public IEnumerable Get()
        {
            return new string[] { "Hello", "Version 1.0", "ReferenceData WebProxy" };
        }

        // GET api/hello/bob
        public string Get(string name)
        {
            return $"Hello, {name}!";
        }
    }
}