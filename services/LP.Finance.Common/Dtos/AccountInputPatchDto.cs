using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class AccountInputPatchDto
    {
        [Required] public string Description { get; set; }
    }
}