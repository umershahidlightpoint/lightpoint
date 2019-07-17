using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI
{
    public class LedgerControllerStub : ILedgerController
    {
        public object Data(string symbol)
        {
            return Utils.GetFile("ledgers");
        }
    }
}