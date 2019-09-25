namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IPostingEngineService
    {
        object StartPostingEngine(string period);
        object StartPostingEngineSingleOrder(string orderId);
        object GetStatus(string key);
        object GetProgress();
        object ClearJournals(string type);
    }
}