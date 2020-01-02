using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LP.Finance.Common.CustomValidators;

namespace LP.Finance.Common.Dtos
{
    public class JournalMetaInputDto
    {
        [Required] public string GridName { get; set; }
    }
}