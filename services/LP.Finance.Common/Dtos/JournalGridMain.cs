using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class JournalGridMain
    {
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public List<JournalGridFilters> filters {get; set;}
    }
}
