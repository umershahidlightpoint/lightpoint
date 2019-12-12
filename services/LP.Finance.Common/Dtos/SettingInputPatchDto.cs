using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{

    public class SettingInputPatchDto
    {
        [Required] public string Description { get; set; }
    }
}
