using System;

namespace LP.Finance.Common.Model
{
    public class DailyPnL
    {
        public int Id { get; set; }
        public int RowId { get; set; }
        public bool Modified { get; set; }
        public DateTime BusinessDate { get; set; }
        public string Fund { get; set; }
        public string PortFolio { get; set; }
        public decimal? TradePnL { get; set; }
        public decimal? Day { get; set; }
        public decimal? DailyPercentageReturn { get; set; }
        public decimal? LongPnL { get; set; }
        public decimal? LongPercentageChange { get; set; }
        public decimal? ShortPnL { get; set; }
        public decimal? ShortPercentageChange { get; set; }
        public decimal? LongExposure { get; set; }
        public decimal? ShortExposure { get; set; }
        public decimal? GrossExposure { get; set; }
        public decimal? NetExposure { get; set; }
        public decimal? SixMdBetaNetExposure { get; set; }
        public decimal? TwoYwBetaNetExposure { get; set; }
        public decimal? SixMdBetaShortExposure { get; set; }
        public decimal? NavMarket { get; set; }
        public decimal? DividendUSD { get; set; }
        public decimal? CommUSD { get; set; }
        public decimal? FeeTaxesUSD { get; set; }
        public decimal? FinancingUSD { get; set; }
        public decimal? OtherUSD { get; set; }
        public decimal? PnLPercentage { get; set; }
        public decimal? MTDPercentageReturn { get; set; }
        public decimal? QTDPercentageReturn { get; set; }
        public decimal? YTDPercentageReturn { get; set; }
        public decimal? ITDPercentageReturn { get; set; }
        public decimal? MTDPnL { get; set; }
        public decimal? QTDPnL { get; set; }
        public decimal? YTDPnL { get; set; }
        public decimal? ITDPnL { get; set; }
        public string CreatedBy { get; set; }
        public string LastUpdatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string LastUpdatedDate { get; set; }
    }
}