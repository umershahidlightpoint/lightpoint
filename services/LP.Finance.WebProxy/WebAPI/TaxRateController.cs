using System.Web.Http;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/taxRate")]
    public class TaxRateController : ApiController
    {
        private readonly ITaxRateService controller = new TaxRateService();

        public TaxRateController()
        {
        }

        [HttpGet, Route("")]
        public object GetTaxRates()
        {
            return controller.GetTaxRates();
        }

        [HttpPost, Route("")]
        public object CreateTaxRate(TaxRateInputDto taxRate)
        {
            return !ModelState.IsValid || taxRate == null ? BadRequest(ModelState) : controller.CreateTaxRate(taxRate);
        }

        [HttpPut, Route("{id:int}")]
        public object EditTaxRate(int id, TaxRateInputDto taxRate)
        {
            return !ModelState.IsValid || taxRate == null
                ? BadRequest(ModelState)
                : controller.EditTaxRate(id, taxRate);
        }

        [Route("{id:int}")]
        [HttpDelete]
        public object DeleteTaxRate(int id)
        {
            return controller.DeleteTaxRate(id);
        }
    }
}