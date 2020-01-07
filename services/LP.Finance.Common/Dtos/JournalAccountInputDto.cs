using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class JournalAccountInputDto
    {
        [Required] public int? AccountId { get; set; }
        [Required] public string EntryType { get; set; }
        [Required] public int AccountCategoryId { get; set; }
        [Required] public int AccountTypeId { get; set; }
    }
}