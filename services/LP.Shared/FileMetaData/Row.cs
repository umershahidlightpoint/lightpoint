using System.Collections.Generic;

namespace LP.Shared.FileMetaData
{
    public class Row : IRow
    {
        public List<IField> Fields { get; set; }
        public int RowNumber { get; set; }
    }
}
