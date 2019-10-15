using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IPerformanceService
    {
        object GetMonthlyPerformance();
        object AddMonthlyPerformance(List<MonthlyPerformance> dto);
    }
}
