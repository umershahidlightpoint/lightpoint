using System;
using System.Collections.Generic;
using System.Text;

namespace LP.FileProcessing.MetaData
{
    public class SilverFileFormat
    {
        public List<FileProperties> header { get; set; }
        public List<FileProperties> trailer { get; set; }
        public List<FileProperties> record { get; set; }
    }
}
