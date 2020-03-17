using System;
using System.Collections.Generic;
using System.Text;

namespace LP.Finance.Common.FileMetaData
{
    public class FileProperties
    {
        public string Source { get; set; }
        public string Destination { get; set; }
        public string Function { get; set; }
        public string Required { get; set; }
        public string Format { get; set; }
        public string Type { get; set; }
    }
}
