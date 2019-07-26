using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IAccountService
    {
        object Data(string symbol, string search = "");

        object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory);

        object CreateAccount(AccountInputDto account);

        object UpdateAccount(int id, AccountInputDto account);

        object PatchAccount(int id, AccountInputPatchDto account);

        object DeleteAccount(int id);
    }
}