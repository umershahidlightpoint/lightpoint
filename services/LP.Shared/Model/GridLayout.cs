using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class GridLayout
    {
        public List<GridColDef> gridColDefs { get; set; }
        public List<SortModel> sortModel { get; set; } = new List<SortModel>();
        public ExpandoObject filterModel { get; set; }
        public ExpandoObject externalFilterModel { get; set; }
    }
}
