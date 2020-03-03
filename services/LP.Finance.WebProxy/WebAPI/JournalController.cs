using System;
using System.Web.Http;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
using LP.Finance.Common.Cache;
using LP.Finance.Common.Model;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the Tiles / Links Resources to the Logged In User
    /// </summary>
    [RoutePrefix("api/journal")]
    public class JournalController : ApiController
    {
        // Mock Service
        // private IJournalService controller = new JournalStub();
        private IJournalService controller = new JournalService();

        public JournalController()
        {
        }

        [Route("data/{refData}")]
        [HttpGet]
        public object Data(string refData, int pageNumber, int pageSize, string sortColumn = "id",
            string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            var key = $"journal_ui-{refData}-{pageNumber}-{pageSize}-{sortColumn}-{sortDirection}-{accountId}-{value}";

            return DataCache.Results(key,
                () =>
                {
                    return controller.Data(refData, pageNumber, pageSize, sortColumn, sortDirection, accountId, value);
                });
        }

        [Route("costBasisReport")]
        [HttpGet]
        public object GetCostBasisReport(DateTime? date = null, string symbol = "", string fund = "ALL")
        {
            return controller.GetCostBasisReport(date, symbol, fund);
        }

        [Route("costBasisChart")]
        [HttpGet]
        public object GetCostBasisChart(string symbol)
        {
            return controller.GetCostBasisChart(symbol);
        }

        [Route("taxLotReport")]
        [HttpGet]
        public object GetTaxLotReport(DateTime? from = null, DateTime? to = null, string symbol = "",
            string fund = "ALL", Boolean side = false)
        {
            return controller.GetTaxLotReport(from, to, fund, symbol, side);
        }

        [Route("closingTaxLots")]
        [HttpGet]
        public object GetClosingTaxLots(string orderid, DateTime? to)
        {
            return controller.GetClosingTaxLots(orderid, to);
        }

        [Route("taxlotsReport")]
        [HttpGet]
        public object GetTaxLotsReport(DateTime? from = null, DateTime? to = null, string fund = "ALL")
        {
            return controller.GetTaxLotsReport(from, to, fund);
        }

        [Route("recon")]
        [HttpGet]
        public object GetReconReport(String source = "day", DateTime? date = null, string fund = "ALL")
        {
            return controller.GetReconReport(source, date, fund);
        }

        [Route("trialBalanceReport")]
        [HttpGet]
        public object TrialBalanceReport(DateTime? from = null, DateTime? to = null, string fund = "ALL")
        {
            return controller.GetTrialBalanceReport(from, to, fund);
        }

        [Route("trialBalanceTile")]
        [HttpGet]
        public object TrialBalanceTile(DateTime? from = null, DateTime? to = null, string fund = "ALL")
        {
            return controller.GetAccountingTileData(from, to, fund);
        }

        [Route("{source:guid}")]
        [HttpGet]
        public object GetJournal(Guid source)
        {
            return controller.GetJournal(source);
        }

        [HttpPost]
        public object AddJournal(JournalInputDto journal)
        {
            return !ModelState.IsValid || journal == null
                ? BadRequest(ModelState)
                : controller.AddJournal(journal);
        }

        [Route("{source:guid}")]
        [HttpPut]
        public object UpdateJournal(Guid source, [FromBody] JournalInputDto journal)
        {
            return !ModelState.IsValid || journal == null
                ? BadRequest(ModelState)
                : controller.UpdateJournal(source, journal);
        }

        [Route("{source:guid}")]
        [HttpDelete]
        public object DeleteJournal(Guid source)
        {
            return controller.DeleteJournal(source);
        }

        [Route("serverSide")]
        [HttpPost]
        public object GetServerSideJournals(ServerRowModel obj)
        {
            return controller.serverSideJournals(obj);
        }

        [Route("totalCount")]
        [HttpPost]
        public object GetTotalCount(ServerRowModel obj)
        {
            return controller.GetTotalCount(obj);
        }

        [Route("metaData")]
        [HttpPost]
        public object GetJournalsMetaData(JournalMetaInputDto obj)
        {

            var cachedData = AppStartCache.GetCachedData(obj.GridName);
            if (cachedData.Item1)
            {
                return cachedData.Item2;
            }
            else
            {
                return controller.GetJournalsMetaData(obj);
            }
        }

        [Route("appMetaData")]
        [HttpGet]
        public object AppMetaData(DateTime to, DateTime from)
        {
            return controller.AppMetaData(to, from);
        }

        [Route("lastPostedDate")]
        [HttpGet]
        public object GetLastPostedDate()
        {
            return controller.GetLastJournalPostedDate();
        }

        [Route("allClosingTaxLots")]
        [HttpGet]
        public object GetAllClosingTaxLots()
        {
            return controller.GetClosingTaxLots();
        }

        [Route("periodJournals")]
        [HttpGet]
        public object GetPeriodJournals(string symbol, DateTime now, string period)
        {
            return controller.GetPeriodJournals(symbol, now, period);
        }

        [Route("validDates")]
        [HttpGet]
        public object GetValidDates(string columnName, string source)
        {
            return controller.GetValidDates(columnName, source);
        }

        [Route("marketValueAppraisalReport")]
        [HttpGet]
        public object GetMarketValueAppraisalReport(DateTime date)
        {
            return controller.GetMarketValueAppraisalReport(date);
        }

        [Route("excludeTrade")]
        [HttpPost]
        public object ExcludeTrade(TradeExclusionInputDto obj)
        {
            return controller.ExcludeTrade(obj);
        }

    }
}