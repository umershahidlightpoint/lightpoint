namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IAccountControllerService
    {
        object Data(string symbol, int pageNumber, int pageSize, string accountName, string accountCategory,
            string search = "");

        object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory);
    }
}