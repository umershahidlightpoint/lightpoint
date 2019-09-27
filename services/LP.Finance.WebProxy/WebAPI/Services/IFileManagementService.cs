namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IFileManagementService
    {
        object GetFiles(string name);
        object GenerateActivityAndPositionFilesForSilver();
        object UploadFiles();
        object DownloadFiles();
    }
}