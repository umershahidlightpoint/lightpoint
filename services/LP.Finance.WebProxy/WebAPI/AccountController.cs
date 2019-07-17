using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class AccountController : ApiController
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private readonly IAccountControllerService controller = new AccountControllerService();

        public AccountController()
        {
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol, string search = "")
        {
            return controller.Data(symbol, search);
        }

        [HttpGet]
        public object GetAccounts()
        {
            return controller.Data("Accounts");
        }
    }
}