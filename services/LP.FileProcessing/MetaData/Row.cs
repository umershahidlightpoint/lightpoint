using System;
using System.Collections.Generic;
using System.Text;

namespace LP.FileProcessing.MetaData
{
    public class Row : IRow
    {
        public List<IField> Fields { get; set; }
        public int RowNumber { get; set; }
    }
}
