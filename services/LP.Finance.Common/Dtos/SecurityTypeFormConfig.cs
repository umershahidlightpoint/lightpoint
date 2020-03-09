using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class SecurityTypeFormConfig
    {
        public string SecurityType;
        public List<SecurityTypeFormFieldNames> Fields { get; set; }
    }
}
