using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class TaxLotReversalDto
    {
        public List<ClosedTaxLot> ClosingLots { get; set; }
        public List<OpenTaxLot> OpenLots { get; set; }
    }
}
