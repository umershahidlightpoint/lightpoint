using System;
using LP.Finance.Common.Model;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IPerformanceService
    {
        object GetMonthlyPerformance(DateTime? dateTo = null, DateTime? dateFrom = null, string fund = null, string portfolio = null);
        object CalculateMonthlyPerformance(List<MonthlyPerformance> dto);
        object AddOrUpdateMonthlyPerformance(List<MonthlyPerformance> dto);
        Task<object> UploadMonthlyPerformance(HttpRequestMessage requestMessage);
        object GetMonthlyPerformanceAudit(int id);
    }
}