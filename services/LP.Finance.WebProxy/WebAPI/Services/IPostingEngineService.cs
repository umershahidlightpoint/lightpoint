namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IPostingEngineService
    {
        object StartPostingEngine(string period);
        object GetStatus(string key);
        object IsPostingEngineRunning();
    }
}