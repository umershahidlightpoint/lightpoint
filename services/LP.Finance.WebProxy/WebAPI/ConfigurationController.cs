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
    [RoutePrefix("api/configuration")]
    public class ConfigurationController : ApiController
    {
        private IConfigurationService controller = new ConfigurationService();

        [HttpGet]
        public object GetConfigurations(string project)
        {
            return controller.GetConfigurations(project);
        }

        [HttpPost]
        public object AddConfiguration(List<ConfigurationInputDto> obj)
        {
            return controller.AddConfig(obj);
        }

        [HttpPut]
        public object UpdateConfiguration(List<ConfigurationInputDto> obj)
        {
            return controller.UpdateConfig(obj);
        }

    }
}
