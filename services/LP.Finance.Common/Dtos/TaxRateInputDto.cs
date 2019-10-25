using System;
using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class TaxRateInputDto
    {
        [Required] public DateTime EffectiveFrom { get; set; }
        [Required] public DateTime EffectiveTo { get; set; }
        [Required] public decimal LongTermTaxRate { get; set; }
        [Required] public decimal ShortTermTaxRate { get; set; }
        [Required] public decimal ShortTermPeriod { get; set; }
    }
}