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
        public object ViewLogFile(string fileName, int numberOfLines)
        {
            return service.ViewLog(fileName, numberOfLines);
        }

        [HttpGet, Route("download")]
        public object DownloadLogFile(string fileName)
        {
            return service.DownloadLog(fileName);
        }
    }
}