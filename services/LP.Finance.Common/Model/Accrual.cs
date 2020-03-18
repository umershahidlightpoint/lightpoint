using System;

namespace LP.Finance.Common.Model
{
    public class Accrual
    {
        public int Id { get; set; }
        public string AccrualId { get; set; }
        public string LPOrderId { get; set; }
        public double? LocalStartAccrual { get; set; }
        public double? LocalEndAccrual { get; set; }
        public double? GrossDivUSD { get; set; }
        public double? NetDivUSD { get; set; }
        public double? TotalLocalAccrual { get; set; }
        public double? TotalNetUSDAccrual { get; set; }
        public int? AccrualDays { get; set; }
        public int? AccrualDaysLeft { get; set; }
        public double? LocalDailyAccrual { get; set; }
        public double? LocalAccruedToDate { get; set; }
        public double? LocalPnLRealizedToDate { get; set; }
        public double? LocalResidualPnL { get; set; }
        public double? LocalResidualAccrual { get; set; }
        public double? LocalDailyPnLAttribution { get; set; }
        public double? LocalDailyCashAttribution { get; set; }
        public double? LocalCashRealizedToDate { get; set; }
        public double? LocalResidualCash { get; set; }
        public double? NavAmount { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? LastProcessedBusDate { get; set; }
        public DateTime? LastProcessedOn { get; set; }
        public string LastProcessedBy { get; set; }
    }
}
