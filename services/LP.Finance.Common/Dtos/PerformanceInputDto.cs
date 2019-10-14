using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class PerformanceInputDto
    {
        public int Id { get; set; }
        public decimal? MonthEndNav { get; set; } 
        public decimal? Performance { get; set; }
        public decimal? MTD { get; set; }
        public DateTime Performance_Date { get; set; }
        public string Fund { get; set; }
        public string Portfolio { get; set; }
        public decimal YTDNetPerformance { get; set; }
        public decimal QTD { get; set; }
        public decimal YTD { get; set; }
        public decimal ITD { get; set; }
        public bool Estimated { get; set; }
    }
}
