using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class TagDto
    {
        [Required] public int? Id { get; set; }
        [Required] public string Value { get; set; }
    }
}