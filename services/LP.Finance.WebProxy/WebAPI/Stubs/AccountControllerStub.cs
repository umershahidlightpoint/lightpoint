using LP.Finance.Common;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    class AccountControllerStub : IAccountControllerService
    {
        public object Data(string symbol, int pageNumber, int pageSize, string accountName, string accountCategory,
            string search = "")
        {
            return Utils.GetFile("accounts");
        }

        public object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory)
        {
            return Utils.GetFile("accounts");
        }
    }
}