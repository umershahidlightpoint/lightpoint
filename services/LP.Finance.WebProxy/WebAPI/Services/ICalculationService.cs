using System;
using LP.Finance.Common.Model;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface ICalculationService
    {
        object GetMonthlyPerformance(DateTime? dateTo = null, DateTime? dateFrom = null, string fund = null,
            string portfolio = null);

        object CalculateMonthlyPerformance(List<MonthlyPerformance> dto);
        object AddOrUpdateMonthlyPerformance(List<MonthlyPerformance> dto);
        Task<object> UploadMonthlyPerformance(HttpRequestMessage requestMessage);
        object CommitMonthlyPerformance(List<MonthlyPerformance> monthlyPerformances);
        object GetMonthlyPerformanceStatus();
        object GetMonthlyPerformanceAudit(int id);
        object GetDailyUnofficialPnl(DateTime? from, DateTime? to);
        object CalculateDailyUnofficialPnl(List<DailyPnL> obj);
        Task<object> UploadDailyUnofficialPnl(HttpRequestMessage requestMessage);
        object CommitDailyUnofficialPnl(List<DailyPnL> dailyPnLs);
        object GetDailyUnofficialPnlStatus();
        object GetDailyUnofficialPnlAudit(int id);
    }
}