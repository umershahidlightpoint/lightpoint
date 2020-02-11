using System;
using System.Collections.Generic;
using System.Text;

namespace LP.Finance.Common.FileMetaData
{
    public class Row : IRow
    {
        public List<IField> Fields { get; set; }
        public int RowNumber { get; set; }
    }
}
