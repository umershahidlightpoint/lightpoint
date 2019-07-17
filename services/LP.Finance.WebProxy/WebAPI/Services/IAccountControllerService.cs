namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IAccountControllerService
    {
        object Data(string symbol, string search = "");
        object GetAccounts();
    }
}