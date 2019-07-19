using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class AccountController : ApiController, IAccountControllerService
    {
        // Mock Service
        //private IJournalController controller = new JournalControllerStub();
        private readonly IAccountControllerService controller = new AccountControllerService();

        public AccountController()
        {
        }

        [HttpGet]
        [ActionName("data")]
        public object Data(string symbol, int pageNumber, int pageSize, string accountName, string accountCategory,
            string search = "")
        {
            return controller.Data(symbol, pageNumber, pageSize, accountName, accountCategory, search);
        }

        [HttpGet]
        public object GetAccounts(int pageNumber = 1, int pageSize = 10000, string accountName = "",
            string accountCategory = "")
        {
            return controller.Data("Accounts", pageNumber, pageSize, accountName, accountCategory);
        }
    }
}