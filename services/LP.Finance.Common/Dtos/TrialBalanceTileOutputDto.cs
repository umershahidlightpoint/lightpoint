using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class TrialBalanceTileOutputDto
    {
        public string FundName { get; set; }
        public decimal? FundCredit { get; set; }
        public decimal? FundDebit { get; set; }
        public decimal FundBalance { get; set; }
        public List<AccountListTileOutputDto> Accounts { get; set; }

    }
}
