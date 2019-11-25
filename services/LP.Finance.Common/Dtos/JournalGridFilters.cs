using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class JournalGridFilters
    {
        public string column { get; set; }
        public bool sort { get; set; }
        public bool sortDirection { get; set; }

        public List<object> data { get; set; }

    }
}