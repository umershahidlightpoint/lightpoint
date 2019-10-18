using LP.Finance.Common.Model;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IPerformanceService
    {
        object GetMonthlyPerformance();
        object CalculateMonthlyPerformance(List<MonthlyPerformance> dto);
        object AddOrUpdateMonthlyPerformance(List<MonthlyPerformance> dto);
        Task<object> UploadMonthlyPerformance(HttpRequestMessage requestMessage);
        object GetMonthlyPerformanceAudit(int id);

    }
}