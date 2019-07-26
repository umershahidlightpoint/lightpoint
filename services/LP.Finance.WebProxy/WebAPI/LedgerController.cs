using System.Web.Http;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// 
    /// </summary>
    public class LedgerController : ApiController, ILedgerService
    {
        // Mock Service
        // private IJournalController controller = new JournalControllerStub();
        private ILedgerService controller = new LedgerService();

        public LedgerController()
        {
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol)
        {
            return controller.Data(symbol);
        }
    }
}