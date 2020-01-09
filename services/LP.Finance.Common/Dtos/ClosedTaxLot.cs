using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class ClosedTaxLot
    {
        public int Id { get; set; }
        public string OpenLotId { get; set; }
        public string ClosingLotId { get; set; }
        public int Quantity { get; set; }
    }
}
