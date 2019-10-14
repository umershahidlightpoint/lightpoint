using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class MonthlyPerformance
    {
        public int Id { get; set; }
        public decimal? MonthEndNav { get; set; }
        public decimal? Performance { get; set; }
        public decimal? MTD { get; set; }
        public DateTime Performance_Date { get; set; }
    }
}
