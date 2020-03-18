using System.Collections.Generic;
using System.Dynamic;

namespace LP.Shared.Model
{
    public class GridLayout
    {
        public List<GridColDef> gridColDefs { get; set; }
        public List<SortModel> sortModel { get; set; } = new List<SortModel>();
        public ExpandoObject filterModel { get; set; }
        public ExpandoObject externalFilterModel { get; set; }
    }
}