using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class AlleviateTaxLotDto
    {
        public List<OpenTaxLot> OpenTaxLots { get; set; }
        public ProspectiveTradeDto ProspectiveTrade { get; set; }
    }
}
