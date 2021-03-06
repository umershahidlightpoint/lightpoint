﻿using System;

namespace PostingEngine.MarketData
{
    public class FxRate
    {
        public string CurrencyCode { get; set; }
        public double Rate { get; set; }

        public DateTime BusinessDate { get; set; }
        public string Key {  get {
                var busDate = BusinessDate.ToString("MM-dd-yyyy");
                return $"{CurrencyCode}@{busDate}"; } }
    }

}
