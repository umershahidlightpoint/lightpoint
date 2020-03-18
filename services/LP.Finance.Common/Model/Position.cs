using System;

namespace LP.Finance.Common.Model
{
    public class Position
    {
        public int IntraDayPositionId { get; set; }
        public DateTime BusDate { get; set; }
        public string Fund { get; set; }
        public string SecurityCode { get; set; }
        public double Quantity { get; set; }
        public double SODQuantity { get; set; }
        public string StrategyCode { get; set; }
        public string SubStrategyCode { get; set; }
        public string PortfolioCode { get; set; }
        public string Currency { get; set; }
        public double StartPrice { get; set; }
        public double StartFx { get; set; }
        public double EndFx { get; set; }
        public double Price { get; set; }
        public double Exposure { get; set; }
        public double DayPnL { get; set; }
        public double MTDPnL { get; set; }
        public double YTDPnL { get; set; }
        public string LastModifiedBy { get; set; }
        public string LastModifiedOn { get; set; }
        public bool Active { get; set; }
        public string PriceSymbol { get; set; }
        public string Side { get; set; }
        public double BetaExp { get; set; }
        public double TradePnL { get; set; }
        public double AvgCost { get; set; }
        public double Beta6M { get; set; }
        public double Delta { get; set; }
        public double Beta2Yw { get; set; }
        public double Beta2YwExp { get; set; }
        public DateTime? ExDate { get; set; }
        public DateTime? ReportDate { get; set; }
        public string RiskCountry { get; set; }
        public double Beta3Wk { get; set; }
        public double Beta3WkExp { get; set; }
        public string SecurityName { get; set; }
        public double Undl_Price { get; set; }
        public int TypeId { get; set; }
        public double SettlePrice { get; set; }
        public double LocalNetNotional { get; set; }
        public double NavMkt { get; set; }
        public double StartAccrual { get; set; }
        public double EndAccrual { get; set; }
        public int NavCategoryTypeId { get; set; }
        public double QTDPnL { get; set; }

    }
}
