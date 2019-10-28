using System;

namespace LP.Finance.Common.Dtos
{
    public class TaxRateOutputDto
    {
        public int Id { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime EffectiveTo { get; set; }
        public decimal LongTermTaxRate { get; set; }
        public decimal ShortTermTaxRate { get; set; }
        public decimal ShortTermPeriod { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string LastUpdatedBy { get; set; }
        public bool IsOverLapped { get; set; }
        public bool IsGapPresent { get; set; }
    }
}