using System.Collections.Generic;

namespace LP.Shared.FileMetaData
{
    public interface IRow
    {
        List<IField> Fields { get; set; }
        int RowNumber { get; set; }
    }
}
