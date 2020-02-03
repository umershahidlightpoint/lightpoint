using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class GridColDef
    {
        public string colId { get; set; }
        public bool hide { get; set; }
        string aggFunc { get; set; }
        int width { get; set; }
        int? rowGroupIndex { get; set; }
    }
}
