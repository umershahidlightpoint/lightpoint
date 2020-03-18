using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;
using LP.Finance.WebProxy.WebAPI.Stubs;
using LP.Shared.Controller;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the Tiles / Links Resources to the Logged In User
    /// </summary>
    public class JournalLogController : ApiController, IJournalLogService
    {
        // Mock Service
        // private IJournalLogService controller = new JournalStub();
        private readonly IJournalLogService controller = ControllerFactory
            .Get<IJournalLogService, JournalLogStub, JournalLogService>();

        [HttpGet]
        [ActionName("data")]
        public object Data(string refdata, int pageNumber, int pageSize, string sortColumn = "id",
            string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            return controller.Data(refdata, pageNumber, pageSize, sortColumn, sortDirection, accountId, value);
        }
    }
}