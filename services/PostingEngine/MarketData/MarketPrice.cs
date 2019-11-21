using System;

namespace PostingEngine.MarketData
{
    public class MarketPrice
    {
        public string Symbol { get; set; }
        public double Price { get; set; }

        public DateTime BusinessDate { get; set; }
        public string Key
        {
            get
            {
                var busDate = BusinessDate.ToString("MM-dd-yyyy");
                return $"{Symbol}@{busDate}";
            }
        }

    }

}
