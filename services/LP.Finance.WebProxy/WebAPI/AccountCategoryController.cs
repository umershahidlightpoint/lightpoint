using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/account_category")]
    public class AccountCategoryController : ApiController, IAccountCategoryControllerService
    {
        private readonly IAccountCategoryControllerService controller = new AccountCategoryControllerService();

        public AccountCategoryController()
        {
        }

        [Route("")]
        [HttpGet]
        public object GetAccountCategories(string accountCategoryName = "")
        {
            return controller.GetAccountCategories(accountCategoryName);
        }
    }
}