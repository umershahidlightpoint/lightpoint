using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class ProspectiveTradeDto
    {
        public int Id { get; set; }
        public string LpOrderId { get; set; }
        public int Quantity { get; set; }
        public string Symbol { get; set; }
        public string Side { get; set; }
    }
}
