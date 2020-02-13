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
    [RoutePrefix("api/corporateAction")]
    public class CorporateActionsController : ApiController
    {
        private ICorporateActionsService controller = new CorporateActionsService();

        [HttpGet]
        [Route("cashDividend")]
        public object GetCashDividends()
        {
            return controller.GetCashDividends();
        }

        [HttpPost]
        [Route("cashDividend")]
        public object CreateCashDividend(CashDividendInputDto obj)
        {
            return controller.CreateCashDividend(obj);
        }

        [HttpPut]
        [Route("cashDividend")]
        public object EditCashDividend(CashDividendInputDto obj)
        {
            return controller.EditCashDividend(obj);
        }

        [HttpPut]
        [Route("deleteCashDividend")]
        public object DeleteCashDividend(int id)
        {
            return controller.DeleteCashDividend(id);
        }

        [HttpGet]
        [Route("cashDividendAudit")]
        public object GetCashDividendAudit(int id)
        {
            return controller.CashDividendAudit(id);
        }

        [HttpGet]
        [Route("cashDividendDetails")]
        public object GetCashDividendDetails()
        {
            return controller.GetDividendDetails();
        }
    }
}
