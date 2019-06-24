using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace frontendapp
{
    public class LedgerInput
    {
        public long id { get; set; }
        public double value { get; set; }
        public long customer_id { get; set; }
        public long account_id { get; set; }
        public long fund_id { get; set; }
        public string effectiveDate { get; set; }
    }
}
