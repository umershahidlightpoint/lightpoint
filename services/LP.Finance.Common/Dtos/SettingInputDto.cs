using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class SettingInputDto
    {
        [Required] public int Id { get; set; }
        [Required] public string Theme { get; set; }
        [Required] public string CurrencyCode { get; set; }
        [Required] public string TaxMethodology { get; set; }
        [Required] public string FiscalMonth { get; set; }
        [Required] public int FiscalDay { get; set; }
    }
}