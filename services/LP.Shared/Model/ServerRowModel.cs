using System.Collections.Generic;
using System.Dynamic;

namespace LP.Finance.Common.Model
{
    public class ServerRowModel
    {
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public int startRow { get; set; }
        public int? endRow { get; set; }
        public List<RowGroupCols> rowGroupCols { get; set; } = new List<RowGroupCols>();
        public List<ValueCols> valueCols { get; set; } = new List<ValueCols>();
        public List<string> groupKeys { get; set; } = new List<string>();
        public List<SortModel> sortModel { get; set; } = new List<SortModel>();
        public ExpandoObject filterModel { get; set; }
        public ExpandoObject externalFilterModel { get; set; }
        // this is a work around and an alternative to value cols.
        //Sometimes the grid returns empty value cols.
        public List<string> havingColumns { get; set; } = new List<string>();
        //those columns which are to be sorted on their absolute value.
       public List<string> absoluteSorting { get; set; } = new List<string>();
        //to be used incase of grid layouts. will participate in creation of select clause for excel reports.
        public List<GridColDef> gridColDefs { get; set; }


    }
}