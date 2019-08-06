using System.Data;
using LP.Finance.Common.Dtos;

namespace LP.Finance.Common.Mappers
{
    public interface IEntityMapper
    {
        AccountsOutputDto MapAccounts(IDataReader reader);
        AccountOutputDto MapAccount(IDataReader reader);
    }
}