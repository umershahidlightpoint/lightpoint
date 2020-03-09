using System;

namespace PostingEngine.CorporateActions
{
    public partial class Dividends
    {
        private class Dividend
        {
            public string Symbol { get; internal set; }
            public DateTime NoticeDate { get; internal set; }
            public DateTime ExecutionDate { get; internal set; }
            public decimal FxRate { get; internal set; }
            public DateTime RecordDate { get; internal set; }
            public DateTime PayDate { get; internal set; }
            public double Rate { get; internal set; }
            public string Ccy { get; internal set; }
            public double WithholdingRate { get; internal set; }
        }
    }
}
