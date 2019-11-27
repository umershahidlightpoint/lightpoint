using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class ServerRowModel
    {
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public List<RowGroupCols> rowGroupCols { get; set;}
        public List<ValueCols> valueCols { get; set; }
        public List<string> groupKeys { get; set; }
        public List<SortModel> sortModel { get; set; }
        public dynamic filterModel { get; set; }

    }
}
