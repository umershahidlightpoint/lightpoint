using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using LP.Finance.Common.Model;

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

        [HttpPost, Route("commit")]
        public object CommitFxRate(List<FxRate> fxRates)
        {
            return controller.CommitFxRate(fxRates);
        }
    }
}