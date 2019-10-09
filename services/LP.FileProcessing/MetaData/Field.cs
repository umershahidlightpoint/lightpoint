using System;
using System.Collections.Generic;
using System.Text;

namespace LP.FileProcessing.MetaData
{
    public class Field : IField
    {
        public string Name { get; set; }
        public object Value { get; set; }
        public string Message { get; set; }
        public FileProperties MetaData { get; set; }
    }
}
