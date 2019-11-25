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
    [RoutePrefix("api/analysis")]
    public class AnalysisController : ApiController
    {
        private IAnalysisService controller = new AnalysisService();
        [Route("journal")]
        [HttpPost]
        public object GetSummarizedJournal(List<GridLayoutDto> layout)
        {
            return controller.GetSummarizedJournal(layout);
        }

        [Route("journalDetails")]
        [HttpPost]
        public object Data(JournalGridMain obj)
        {
            return controller.GetJournalDetails(obj);
        }
    }
}
