using System.Web.Http;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// 
    /// </summary>
    public class LedgerController : ApiController, ILedgerController
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private ILedgerController controller = new LedgerControllerService();
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