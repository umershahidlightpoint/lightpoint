using LP.Finance.Common.Dtos;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using LP.Finance.Common.Model;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface IFxRateService
    {
        object AuditTrail(int id);
        object GetFxRates();
        object SetFxRates(List<FxRateInputDto> obj);
        Task<object> Upload(HttpRequestMessage requestMessage);
        object CommitFxRate(List<FxRate> fxRates);
    }
}