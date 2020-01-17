using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class OpenTaxLot
    {
        public int Id { get; set; }
        public string OpenLotId { get; set; }
        public string Symbol { get; set; }
        public string Status { get; set; }
        public string Side { get; set; }
        public int OriginalQuantity { get; set; }
        public int RemainingQuantity { get; set; }
        public double TradePrice { get; set; }
    }
}
