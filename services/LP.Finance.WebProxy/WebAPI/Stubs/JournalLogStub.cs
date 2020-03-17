using LP.Finance.Common;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    public class JournalLogStub : IJournalLogService
    {
        public object Data(string symbol, int pageNumber, int pageSize, string sortColumn = "id",
            string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            return Shared.WebApi.GetFile("journallogs");
        }
    }
}