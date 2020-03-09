using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public class SecurityDetailsInputDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public DateTime? MaturityDate { get; set; }
        public DateTime? ValuationDate { get; set; }
        public decimal? Spread { get; set; }
        public string SecurityReturnDescription { get; set; }
        public string FinancingLeg { get; set; }
        public DateTime? FinancingEndDate { get; set; }
        public DateTime? FinancingPaymentDate { get; set; }
        public string FinancingResetDateType { get; set; }
        public string FinancingResetDate { get; set; }
        public string NextFinancingEndDateType { get; set; }
        public string NextFinancingEndDate { get; set; }
        public decimal? FixedRate { get; set; }
        public string DCCFixedRate { get; set; }
        public string FloatingRate { get; set; }
        public string DCCFloatingRate { get; set; }
        public string PrimaryMarket { get; set; }
        public decimal? ReferenceEquity { get; set; }
        public decimal? ReferenceObligation { get; set; }
        public decimal? Upfront { get; set; }
        public decimal? PremiumRate { get; set; }
        public decimal? PremiumFrequency { get; set; }
    }
}
