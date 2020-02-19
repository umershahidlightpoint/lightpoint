using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class StockSplitInputDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public DateTime NoticeDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        public decimal TopRatio { get; set; }
        public decimal BottomRatio { get; set; }
        public decimal AdjustmentFactor { get; set; }
    }
}

