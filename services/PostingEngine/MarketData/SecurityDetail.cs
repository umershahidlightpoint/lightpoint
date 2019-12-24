namespace PostingEngine.MarketData
{
    public class SecurityDetail
    {
        public string BloombergCode { get; internal set; }
        public string EzeTicker { get; internal set; }
        public string SecurityCode { get; internal set; }
        public double Multiplier { get; internal set; }
    }
}
