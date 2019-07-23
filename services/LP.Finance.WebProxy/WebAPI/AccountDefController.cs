using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/account_def")]
    public class AccountDefController : ApiController, IAccountDefControllerService
    {
        private readonly IAccountDefControllerService controller = new AccountDefControllerService();

        public AccountDefController()
        {
        }

        [Route("")]
        [HttpGet]
        public object GetAccountDefs()
        {
            return controller.GetAccountDefs();
        }
    }
}