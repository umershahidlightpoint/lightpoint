using System;
using System.Collections.Generic;
using System.Text;

namespace LP.FileProcessing.MetaData
{
    public class SilverMetaDataForPosition
    {
        public string Security_ID { get; set; }
        public string Symbol { get; set; }
        public string Security_Currency { get; set; }

        public Dictionary<string, string> mapping = new Dictionary<string, string> {
            {"Security_ID", "Silver_Security_ID" },
            {"Symbol", "Silver_Symbol" }
        };
    }
}
