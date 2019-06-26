using System.Collections;
using System.Linq;
using System;
using System.Web.Http;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    public class EnvironmentController : ApiController
    {
        // GET api/environment
        public IEnumerable Get()
        {
            var currentPrincipal = System.Security.Principal.GenericPrincipal.Current;
            var array = currentPrincipal.Identities.ToArray();     //User.Identity!= null ? User.Identity.Name : "UNKNOWN";

            var names = String.Join(", ", (from a in array select a.Name));

            return new string[] {
                "Authentication Details",
                names,
                Environment.UserName };
        }
    }
}