namespace PostingEngine.MarketData
{
    public class TradeTaxRate
    {
        public decimal Rate { get; set; }

        public int DaysToLongTerm { get; set; }

        public bool IsShortTerm { get; set; }
    }

}
