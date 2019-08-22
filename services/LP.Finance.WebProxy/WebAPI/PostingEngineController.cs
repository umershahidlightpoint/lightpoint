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

        // GET api/postingEngine/status/{key}
        [Route("status/{key}")]
        [HttpGet]
        public object Status(string key)
        {
            return controller.GetStatus(key);
        }

        [Route("IsPostingEngineRunning")]
        [HttpGet]
        public object IsPostingEngineRunning()
        {
            return controller.IsPostingEngineRunning();
        }

        // GET api/postingEngine
        [HttpDelete]
        public object Clear(string type)
        {
            return controller.ClearJournals(type);
        }
    }
}