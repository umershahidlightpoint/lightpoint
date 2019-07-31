using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/account_tag")]
    public class AccountTagController : ApiController, IAccountTagService
    {
        private readonly IAccountTagService controller = new AccountTagService();

        public AccountTagController()
        {
        }

        [Route("")]
        [HttpGet]
        public object GetAccountTags(string accountTagName = "")
        {
            return controller.GetAccountTags(accountTagName);
        }
    }
}