using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/security")]
    public class SecurityController : ApiController
    {
        private ISecurityService controller = new SecurityService();

        [HttpGet]
        [Route("details")]
        public object GetSecurityDetails(string symbol)
        {
            return controller.GetSecurityDetails(symbol);
        }

        [HttpPost]
        [Route("details")]
        public object AddSecurityDetails(SecurityDetailsInputDto details)
        {
            return controller.AddSecurityDetails(details);
        }

        [HttpPut]
        [Route("details")]
        public object EditSecurityDetails(SecurityDetailsInputDto details)
        {
            return controller.EditSecurityDetails(details);
        }
    }
}
