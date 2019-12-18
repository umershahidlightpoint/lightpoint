using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    class AccountStub : IAccountService
    {
        public object Data(string symbol, string search = "")
        {
            return Utils.GetFile("accounts");
        }

        public object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory)
        {
            return Utils.GetFile("accounts");
        }

        public object GetAccount(int id)
        {
            throw new System.NotImplementedException();
        }

        public object CreateAccount(AccountInputDto account)
        {
            throw new System.NotImplementedException();
        }

        public object UpdateAccount(int id, AccountInputDto account)
        {
            throw new System.NotImplementedException();
        }

        public object PatchAccount(int id, AccountInputPatchDto account)
        {
            throw new System.NotImplementedException();
        }

        public object DeleteAccount(int id)
        {
            throw new System.NotImplementedException();
        }

        public object GetThirdPartyOrganizationAccounts()
        {
            throw new System.NotImplementedException();
        }
    }
}