using LP.Finance.WebProxy.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/fileManagement")]
    public class FileManagementController : ApiController
    {
        private IFileManagementService controller = new FileManagementService();

        // GET api/fileManagement/files
        [Route("files")]
        [HttpGet]
        public object GetFiles(string name = "All")
        {
            return controller.GetFiles(name);
        }

        [Route("SilverEndOfDay")]
        [HttpPost]
        public object GenerateActivityAndPositionFilesForSilver()
        {
            return controller.GenerateActivityAndPositionFilesForSilver();
        }

    }
}
