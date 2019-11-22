using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class GridLayoutDto
    {
        public string colId { get; set; }
        public bool hide { get; set; }
        public string aggFunc { get; set; }
        public int? rowGroupIndex { get; set; }
    }
}
