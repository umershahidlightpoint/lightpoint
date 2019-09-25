using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/postingEngine")]
    public class PostingEngineController : ApiController
    {
        private IPostingEngineService controller = new PostingEngineService();

        // GET api/postingEngine
        [HttpGet]
        public object Get(string period = "ITD")
        {
            return controller.StartPostingEngine(period);
        }

        [HttpGet]
        [Route("order")]
        public object Order(string orderId = null)
        {
            return controller.StartPostingEngineSingleOrder(orderId);
        }

        // GET api/postingEngine/status/{key}
        [Route("status/{key}")]
        [HttpGet]
        public object Status(string key)
        {
            return controller.GetStatus(key);
        }

        // GET api/postingEngine/progress
        [Route("progress")]
        [HttpGet]
        public object GetProgress()
        {
            return controller.GetProgress();
        }

        // DELETE api/postingEngine
        [HttpDelete]
        public object Clear(string type)
        {
            return controller.ClearJournals(type);
        }
    }
}