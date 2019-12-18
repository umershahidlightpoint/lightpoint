﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class ChartOfAccountMappingDto
    {
        public int AccountId { get; set; }

        public List<ThirdPartyAccount> ThirdPartyAccountMapping { get; set; }
    }
}
