using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/account_category")]
    public class AccountCategoryController : ApiController, IAccountCategoryService
    {
        private readonly IAccountCategoryService controller = new AccountCategoryService();

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