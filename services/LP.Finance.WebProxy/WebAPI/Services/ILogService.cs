namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface ILogService
    {
        object GetLogFiles();
        object ViewLog(string fileName, int numberOfLines);
        object DownloadLog(string fileName);
    }
}