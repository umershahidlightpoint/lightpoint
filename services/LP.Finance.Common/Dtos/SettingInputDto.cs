using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LP.Finance.Common.CustomValidators;

namespace LP.Finance.Common.Dtos
{
    public class SettingInputDto
    {
        [Required] public string Description { get; set; }
        [Required] public int? Type { get; set; }
        [MinimumElements(0)] public List<SettingTagInputDto> Tags { get; set; }
    }
}
