using System;

namespace PostingEngine.CorporateActions
{
    public partial class Dividends
    {
        private class ExcercisedDividends
        {
            public string Symbol { get; internal set; }
            public string Currency { get; internal set; }
            public DateTime ExecutionDate { get; internal set; }
            public DateTime NoticeDate { get; internal set; }
            public DateTime RecordDate { get; internal set; }
            public bool Long { get; internal set; }
            public int SecurityId { get; set; }
            public double Quantity { get; internal set; }
            public string Source { get; internal set; }
            public double FxRate { get; internal set; }
            public string Fund { get; internal set; }
            public double BaseGross { get; internal set; }
            public double BaseWithholding { get; internal set; }
            public double BaseNet { get; internal set; }

            public double SettleGross { get; internal set; }
            public double SettleWithholding { get; internal set; }
            public double SettleNet { get; internal set; }

        }
    }
}
