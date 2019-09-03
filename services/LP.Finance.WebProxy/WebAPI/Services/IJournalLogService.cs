namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IJournalLogService
    {
        object Data(string symbol, int pageNumber, int pageSize, string sortColumn = "id", string sortDirection = "asc",
            int accountId = 0, int value = 0);
    }
}