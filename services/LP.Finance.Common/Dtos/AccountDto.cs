using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class AccountDto
    {
        [Required] public string Description { get; set; }
        [Required] public int? Category { get; set; }
        [Required] public List<TagDto> Tags { get; set; }
    }
}