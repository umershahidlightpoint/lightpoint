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
    [RoutePrefix("api/taxLotMaintenance")]
    public class TaxLotMaintenanceController : ApiController
    {
        private ITaxLotMaintenanceService controller = new TaxLotMaintenanceService();

        [Route("reverseTaxLotAlleviation")]
        [HttpPut]
        public object ReverseTaxLot(TaxLotReversalDto obj)
        {
            return controller.ReverseTaxLotAlleviation(obj);
        }

        [Route("alleviateTaxLot")]
        [HttpPut]
        public object AlleviateTaxLot(AlleviateTaxLotDto obj)
        {
            return controller.AlleviateTaxLot(obj);
        }

        [HttpGet]
        [Route("prospectiveTradesToAlleviateTaxLot")]
        public object ProspectiveTradesForTaxLotAlleviation(string symbol, string side)
        {
            return controller.ProspectiveTradesForTaxLotAlleviation(symbol, side);
        }

    }
}
