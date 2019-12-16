using System.Runtime.InteropServices.WindowsRuntime;
using System.Web.Http;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the Tiles / Links Resources to the Logged In User
    /// </summary>
    [RoutePrefix("api/setting")]
    public class SettingController : ApiController
    {
        private readonly ISettingService controller = new SettingService();

        public SettingController()
        {
        }

        [Route("currency")]
        [HttpGet]
        public object GetCurrency()
        {
            return controller.GetReportingCurrencies();
        }

        [Route("")]
        [HttpPost]
        public object AddSetting([FromBody] SettingInputDto setting)
        {
            return !ModelState.IsValid || setting == null ? BadRequest(ModelState) : controller.AddSetting(setting);
        }

        [Route("")]
        [HttpPut]
        public object UpdateSetting([FromBody] SettingInputDto setting)
        {
            return !ModelState.IsValid || setting == null? BadRequest(ModelState): controller.UpdateSetting(setting);
        }

        [Route("")]
        [HttpGet]
        public object GetSetting()
        {
            return controller.GetSetting();
        }
    }
}