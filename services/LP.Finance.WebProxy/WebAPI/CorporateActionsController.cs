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
        public object DeleteCashDividend(DeleteCashDividendInputDto obj)
        {
            return controller.DeleteCashDividend(obj.Id);
        }

        [HttpGet]
        [Route("cashDividendAudit")]
        public object GetCashDividendAudit(int id)
        {
            return controller.CashDividendAudit(id);
        }

        [HttpGet]
        [Route("cashDividendDetails")]
        public object GetCashDividendDetails(DateTime executionDate, int id)
        {
            return controller.GetDividendDetails(executionDate, id);
        }

        // Stock Splits Controller

        [HttpGet]
        [Route("stockSplits")]
        public object GetStockSplits()
        {
            return controller.GetStockSplits();
        }

        [HttpPost]
        [Route("stockSplit")]
        public object CreateStockSplit(StockSplitInputDto obj)
        {
            return controller.CreateStockSplit(obj);
        }

        [HttpPut]
        [Route("stockSplit")]
        public object EditstockSplit(StockSplitInputDto obj)
        {
            return controller.EditStockSplit(obj);
        }

        [HttpPut]
        [Route("deleteStockSplit")]
        public object DeleteStockSplit(DeleteStockSplitInputDto obj)
        {
            return controller.DeleteStockSplit(obj.Id);
        }

        [HttpGet]
        [Route("stockSplitAudit")]
        public object GetStockSplitAudit(int id)
        {
            return controller.StockSplitAudit(id);
        }

        [HttpGet]
        [Route("stockSplitDetails")]
        public object GetStockSplitDetails(int id)
        {
            return controller.GetStockSplitDetails(id);
        }
    }
}
