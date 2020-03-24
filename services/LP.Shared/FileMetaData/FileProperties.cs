using System.Collections.Generic;

namespace LP.Shared.FileMetaData
{
    public class FileProperties
    {
        public string Source { get; set; }
        public string Destination { get; set; }
        public List<FunctionFormat> Function { get; set; }
        public string Required { get; set; }
        public string Format { get; set; }
        public string Type { get; set; }
    }
}
