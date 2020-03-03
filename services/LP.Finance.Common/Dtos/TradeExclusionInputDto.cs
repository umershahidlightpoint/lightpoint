using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class TradeExclusionInputDto
    {
        public string LpOrderId { get; set; }
        public string Reason { get; set; }
        public char Exclude { get; set; }
    }
}
