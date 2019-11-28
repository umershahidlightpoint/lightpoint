using LP.Finance.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface IFxRateService
    {
        Task<object> Upload(HttpRequestMessage requestMessage);
        object GetFxRates();
        object SetFxRates(List<FxRateInputDto> obj);
        object AuditTrail(int id);
    }
}
