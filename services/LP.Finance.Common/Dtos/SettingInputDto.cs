using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LP.Finance.Common.CustomValidators;

namespace LP.Finance.Common.Dtos
{
    public class SettingInputDto
    {
        [Required] public string CurrencyCode { get; set; }
        [Required] public string TaxMethodology { get; set; }
        [Required] public string FiscalMonth { get; set; }
        [Required] public int FiscalDay { get; set; }
    }
}
