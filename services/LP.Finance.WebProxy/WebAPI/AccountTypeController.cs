using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/account_type")]
    public class AccountTypeController : ApiController, IAccountTypeService
    {
        private readonly IAccountTypeService controller = new AccountTypeService();

        public AccountTypeController()
        {
        }

        [Route("")]
        [HttpGet]
        public object GetAccountTypes([FromUri] int? accountCategoryId = null)
        {
            return controller.GetAccountTypes(accountCategoryId);
        }
    }
}