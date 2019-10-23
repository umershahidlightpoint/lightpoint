using System;
using System.Collections.Generic;
using LP.Finance.Common.Model;
using LP.Finance.WebProxy.WebAPI.Services;
using Newtonsoft.Json;

namespace LP.Finance.WebProxy.WebAPI.Resolvers
{
    public class PerformanceResolver
    {
        public static List<MonthlyPerformance> GetMonthlyPerformance(string dateFrom, string dateTo, string fund, string portfolio)
        {
            var performanceDateFrom = string.IsNullOrWhiteSpace(dateFrom) ? (DateTime?) null : Convert.ToDateTime(dateFrom);
            var performanceDateTo = string.IsNullOrWhiteSpace(dateTo) ? (DateTime?)null : Convert.ToDateTime(dateTo);
            var monthlyPerformanceResult =
                new CalculationService().GetMonthlyPerformance(performanceDateFrom, performanceDateTo, fund, portfolio);
            var monthlyPerformance = monthlyPerformanceResult.GetType().GetProperty("data")
                ?.GetValue(monthlyPerformanceResult, null);

            var records = JsonConvert.SerializeObject(monthlyPerformance);
            var performanceRecords = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(records);

            return performanceRecords;
        }
    }
}