using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
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
        public object GenerateActivityAndPositionFilesForSilver(FileGenerationInputDto dto)
        {
            return controller.GenerateActivityAndPositionFilesForSilver(dto);
        }

        // GET api/fileManagement/upload
        [Route("upload")]
        [HttpGet]
        public object UploadFiles()
        {
            return controller.UploadFiles();
        }

        // GET api/fileManagement/download
        [Route("download")]
        [HttpGet]
        public object DownloadFiles()
        {
            return controller.DownloadFiles();
        }

        [Route("ImportFilesFromSilver")]
        [HttpPost]
        public object ImportFilesFromSilver()
        {
            return controller.ImportFilesFromSilver();
        }

        [Route("UpdateFileAction")]
        [HttpPost]
        public object FileAction(FileActionInputDto dto)
        {
            return controller.UpdateFileAction(dto);
        }
    }
}