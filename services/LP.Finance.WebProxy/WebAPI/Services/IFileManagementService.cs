using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IFileManagementService
    {
        object GetFiles(string name);
        object GenerateActivityAndPositionFilesForSilver(FileGenerationInputDto dto);
        object ImportFilesFromSilver();
        object UploadFiles();
        object DownloadFiles();
        object UpdateFileAction(FileActionInputDto input);

    }
}