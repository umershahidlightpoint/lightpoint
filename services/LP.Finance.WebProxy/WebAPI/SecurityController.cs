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
        [Route("config")] // for get fields for specific symbol
        public object GetSecurityConfig(string symbol)
        {
            return controller.GetSecurityConfig(symbol);
        }

        [HttpGet]
        [Route("details")]
        public object GetSecurityDetails()
        {
            return controller.GetSecurityDetails();
        }

        [HttpGet]
        [Route("detail")] // for get single security detail if exists or not
        public object GetSecurityDetail(string symbol)
        {
            return controller.GetSecurityDetail(symbol);
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

        [HttpPut]
        [Route("deleteSecurityDetail")]
        public object DeleteSecurityDetail(SecurityDetailsInputDto details)
        {
            return controller.DeleteSecurityDetail(details.Id);
        }
    }
}
