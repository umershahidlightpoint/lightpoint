using System;
using System.Collections.Generic;
using System.Text;

namespace LP.Finance.Common.FileMetaData
{
    public interface IRow
    {
        List<IField> Fields { get; set; }
        int RowNumber { get; set; }
    }
}
