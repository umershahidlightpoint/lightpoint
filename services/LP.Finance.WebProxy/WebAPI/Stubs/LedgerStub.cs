using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI
{
    public class LedgerStub : ILedgerService
    {
        public object Data(string symbol)
        {
            return Shared.WebApi.GetFile("ledgers");
        }
    }
}