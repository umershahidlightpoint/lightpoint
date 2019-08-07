using System.Web.Http;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the Tiles / Links Resources to the Logged In User
    /// </summary>
    [RoutePrefix("api/account")]
    public class AccountController : ApiController, IAccountService
    {
        private readonly IAccountService controller = new AccountService();

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

        [Route("{id:int}")]
        [HttpGet]
        public object GetAccount(int id)
        {
            return controller.GetAccount(id);
        }

        [Route("")]
        [HttpPost]
        public object CreateAccount(AccountInputDto account)
        {
            return !ModelState.IsValid || account == null
                ? BadRequest(ModelState)    
                : controller.CreateAccount(account);
        }

        [Route("{id:int}")]
        [HttpPut]
        public object UpdateAccount(int id, AccountInputDto account)
        {
            return !ModelState.IsValid || account == null
                ? BadRequest(ModelState)
                : controller.UpdateAccount(id, account);
        }

        [Route("{id:int}")]
        [HttpPatch]
        public object PatchAccount(int id, AccountInputPatchDto account)
        {
            return !ModelState.IsValid || account == null
                ? BadRequest(ModelState)
                : controller.PatchAccount(id, account);
        }

        [Route("{id:int}")]
        [HttpDelete]
        public object DeleteAccount(int id)
        {
            return controller.DeleteAccount(id);
        }
    }
}