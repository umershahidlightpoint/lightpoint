using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LP.Finance.Common.CustomValidators;

namespace LP.Finance.Common.Dtos
{
    public class AccountInputDto
    {
        [Required] public string Description { get; set; }
        [Required] public int? Category { get; set; }
        [MinimumElements(1)] public List<TagDto> Tags { get; set; }
    }
}