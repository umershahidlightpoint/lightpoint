using LP.Finance.WebProxy.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
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

        [HttpGet, Route("download")]
        public object DownloadLogFile(string path, string fileName)
        {
            return service.DownloadLog(path, fileName);
        }
    }
}
