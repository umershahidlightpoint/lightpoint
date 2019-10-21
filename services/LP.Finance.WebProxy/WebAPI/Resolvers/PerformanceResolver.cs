using System.Collections.Generic;
using LP.Finance.Common.Model;
using LP.Finance.WebProxy.WebAPI.Services;
using Newtonsoft.Json;

namespace LP.Finance.WebProxy.WebAPI.Resolvers
{
    public class PerformanceResolver
    {
        public static List<MonthlyPerformance> GetMonthlyPerformance()
        {
            var monthlyPerformanceResult = new PerformanceService().GetMonthlyPerformance();
            var monthlyPerformance = monthlyPerformanceResult.GetType().GetProperty("data")?.GetValue(monthlyPerformanceResult, null);

            var records = JsonConvert.SerializeObject(monthlyPerformance);
            var performanceRecords = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(records);

            return performanceRecords;
        }
    }
}
