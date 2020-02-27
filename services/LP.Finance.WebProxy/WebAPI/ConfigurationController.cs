using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
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
        public object AddConfiguration(ConfigurationInputDto obj)
        {
            return controller.AddConfig(obj);
        }

        [HttpPut]
        public object UpdateConfiguration(ConfigurationInputDto obj)
        {
            return controller.UpdateConfig(obj);
        }
    }
}