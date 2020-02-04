using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class JournalAccountInputDto
    {
        public int JournalId { get; set; }
        public int AccountId { get; set; }
        [Required] public string EntryType { get; set; }
        [Required] public int AccountCategoryId { get; set; }
        [Required] public int AccountTypeId { get; set; }
        [Required] public string Symbol { get; set; }
        [Required] public string AccountCategoryName { get; set; }
        [Required] public string AccountTypeName { get; set; }
        [Required] public string Currency { get; set; }

    }
}