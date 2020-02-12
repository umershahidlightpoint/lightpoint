using LP.Finance.Common.Dtos;
using System.Collections.Generic;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IAccountService
    {
        object Data(string symbol, string search = "");

        object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory);
        object GetAllAccounts();
        object GetMappedAccounts();

        object GetAccount(int id);

        object CreateAccount(AccountInputDto account);

        object UpdateAccount(int id, AccountInputDto account);

        object PatchAccount(int id, AccountInputPatchDto account);

        object DeleteAccount(int id);

        object GetThirdPartyOrganizationAccounts();

        object CreateOrUpdateChartOfAccountMapping(List<ChartOfAccountMappingDto> obj);
    }
}