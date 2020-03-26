using LP.Finance.WebProxy.WebAPI.Services;
using System.Web.Http;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/log")]
    public class LogController : ApiController
    {
        private ILogService service = new LogService();

        [HttpGet, Route("files")]
        public object GetLogFiles()
        {
            return service.GetLogFiles();
        }

        [HttpGet, Route("view")]
        public object ViewLogFile(string fileName, string project, int numberOfLines)
        {
            return service.ViewLog(fileName, project, numberOfLines);
        }

        [HttpGet, Route("download")]
        public object DownloadLogFile(string fileName, string project)
        {
            return service.DownloadLog(fileName, project);
        }
    }
}