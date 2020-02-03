using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class JournalMetaInputDto
    {
        [Required] public string GridName { get; set; }
    }
}