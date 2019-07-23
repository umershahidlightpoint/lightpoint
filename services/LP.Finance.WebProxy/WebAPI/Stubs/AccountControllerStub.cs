using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    class AccountControllerStub : IAccountControllerService
    {
        public object Data(string symbol, string search = "")
        {
            return Utils.GetFile("accounts");
        }

        public object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory)
        {
            return Utils.GetFile("accounts");
        }

        public object CreateAccount(AccountDto account)
        {
            throw new System.NotImplementedException();
        }

        public object UpdateAccount(int id, Account account)
        {
            throw new System.NotImplementedException();
        }

        public object DeleteAccount(int id)
        {
            throw new System.NotImplementedException();
        }
    }
}