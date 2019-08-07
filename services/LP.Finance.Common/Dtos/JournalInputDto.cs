using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class JournalInputDto
    {
        [Required] public int? AccountFrom { get; set; }
        [Required] public int? AccountTo { get; set; }
        [Required] public decimal? Value { get; set; }
        [Required] public string Fund { get; set; }
    }
}