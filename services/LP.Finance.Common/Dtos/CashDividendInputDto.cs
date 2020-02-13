using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class CashDividendInputDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public DateTime NoticeDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        public DateTime RecordDate { get; set; }
        public DateTime PayDate { get; set; }
        public decimal Rate { get; set; }
        public string Currency { get; set; }
        public decimal WithholdingRate { get; set; }
        public decimal FxRate { get; set; }
    }
}
