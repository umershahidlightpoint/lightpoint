using System;
using System.Collections.Generic;
using System.Text;

namespace LP.FileProcessing.MetaData
{
    public interface IRow
    {
        List<IField> Fields { get; set; }
        int RowNumber { get; set; }
    }
}
