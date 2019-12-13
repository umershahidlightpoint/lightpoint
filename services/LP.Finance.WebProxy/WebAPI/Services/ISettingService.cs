using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface ISettingService
    {
        object GetReportingCurrencies();
        object AddSetting(SettingInputDto setting);
        object UpdateSetting(SettingInputDto setting);
        object GetSetting();
    }
}
