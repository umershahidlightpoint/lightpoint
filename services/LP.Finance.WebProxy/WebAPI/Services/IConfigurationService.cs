using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface IConfigurationService
    {
        object GetConfigurations(string project);
        object AddConfig(ConfigurationInputDto obj);
        object UpdateConfig(ConfigurationInputDto obj);
    }
}