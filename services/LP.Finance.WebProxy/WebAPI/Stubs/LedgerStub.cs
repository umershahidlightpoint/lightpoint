using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    public class LedgerStub : ILedgerService
    {
        public object Data(string symbol)
        {
            return Shared.WebApi.GetFile("ledgers");
        }
    }
}