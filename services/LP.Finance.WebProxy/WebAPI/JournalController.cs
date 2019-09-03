using System;
using System.Web.Http;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
using LP.Finance.Common.Cache;

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

        [Route("trialBalanceReport")]
        [HttpGet]
        public object TrialBalanceReport(DateTime? from = null, DateTime? to = null, string fund = "ALL")
        {
            return controller.GetTrialBalanceReport(from, to, fund);
        }

        [Route("{source:guid}")]
        [HttpGet]
        public object GetAccount(Guid source)
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
    }
}