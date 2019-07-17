using LP.Finance.Common;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    class AccountControllerStub : IAccountControllerService
    {
        public object Data(string symbol, string search = "")
        {
            return Utils.GetFile("accounts");
        }

        public object GetAccounts()
        {
            return Utils.GetFile("accounts");
        }
    }
}