using System.Web.Http;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    [RoutePrefix("api/account")]
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
        public object Data(string symbol, string search = "")
        {
            return controller.Data(symbol, search);
        }

        [Route("")]
        [HttpGet]
        public object GetAccounts(int pageNumber = 1, int pageSize = 40, string accountName = "",
            string accountCategory = "")
        {
            return controller.GetAccounts(pageNumber, pageSize, accountName, accountCategory);
        }

        [Route("")]
        [HttpPost]
        public object CreateAccount(AccountDto account)
        {
            return !ModelState.IsValid || account == null
                ? BadRequest(ModelState)
                : controller.CreateAccount(account);
        }

        [Route("{name:int}")]
        [HttpPut]
        public object UpdateAccount(int name, Account account)
        {
            return !ModelState.IsValid || account == null
                ? BadRequest(ModelState)
                : controller.UpdateAccount(name, account);
        }

        [Route("{id:int}")]
        [HttpDelete]
        public object DeleteAccount(int id)
        {
            return controller.DeleteAccount(id);
        }
    }
}