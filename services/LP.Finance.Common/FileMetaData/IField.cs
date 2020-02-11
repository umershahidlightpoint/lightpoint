using System;
using System.Collections.Generic;
using System.Text;

namespace LP.Finance.Common.FileMetaData
{
    public interface IField
    {
        string Name { get; set; }
        object Value { get; set; }
        string Message { get; set; }
        FileProperties MetaData { get; set; }
    }
}
