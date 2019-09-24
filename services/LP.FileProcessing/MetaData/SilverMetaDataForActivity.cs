using System;
using System.Collections.Generic;
using System.Text;

namespace LP.FileProcessing.MetaData
{
    public class SilverMetaDataForActivity
    {
        public string Security_ID { get; set; }
        public string Symbol { get; set; }
        public string Security_Currency { get; set; }
        public double Quantity { get; set; }
        public string Long_Position_Indicator { get; set; }
        public string Settlement_Date { get; set; }
        public string Trade_Date { get; set; }

    }
}
