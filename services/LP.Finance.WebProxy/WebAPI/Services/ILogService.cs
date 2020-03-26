namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface ILogService
    {
        object GetLogFiles();
        object ViewLog(string fileName, string project, int numberOfLines);
        object DownloadLog(string fileName, string project);
    }
}