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
    [RoutePrefix("api/taxLotMaintainance")]
    public class TaxLotMaintainanceController : ApiController
    {
        private ITaxLotMaintainanceService controller = new TaxLotMaintainanceService();

        [Route("reverseTaxLotAlleviation")]
        [HttpPut]
        public object ReverseTaxLot(TaxLotReversalDto obj)
        {
            return controller.ReverseTaxLotAlleviation(obj);
        }

        [Route("alleviateTaxLot")]
        [HttpPut]
        public object AlleviateTaxLot()
        {
            return controller.AlleviateTaxLot();
        }

    }
}
