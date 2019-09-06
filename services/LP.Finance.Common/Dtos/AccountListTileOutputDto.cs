using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class AccountListTileOutputDto
    {
        public string AccountName { get; set; }
        public decimal? AccountCredit { get; set; }
        public decimal? AccountDebit { get; set; }
        public decimal AccountBalance { get; set; }
    }
}
