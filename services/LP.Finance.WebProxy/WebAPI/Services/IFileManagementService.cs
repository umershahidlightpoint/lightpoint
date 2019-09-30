namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IFileManagementService
    {
        object GetFiles(string name);
        object GenerateActivityAndPositionFilesForSilver();
        object ImportFilesFromSilver();
        object UploadFiles();
        object DownloadFiles();
        object GetS3Files();
    }
}