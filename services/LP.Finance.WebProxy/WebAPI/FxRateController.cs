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
    [RoutePrefix("api/fxRates")]
    public class FxRateController : ApiController
    {
        private IFxRateService controller = new FxRateService();

        [HttpGet, Route("fxRate")]
        public object GetFxRate()
        {
            return controller.GetFxRates();
        }

        [HttpGet, Route("audit")]
        public object GetAuditTrail(int id)
        {
            return controller.AuditTrail(id);
        }

        [HttpPut, Route("fxRate")]
        public object SetFxRate(List<FxRateInputDto> obj)
        {
            return controller.SetFxRates(obj);
        }

        [HttpPost, Route("upload")]
        public async Task<object> Upload()
        {
            return await controller.Upload(Request);
        }
    }
}
