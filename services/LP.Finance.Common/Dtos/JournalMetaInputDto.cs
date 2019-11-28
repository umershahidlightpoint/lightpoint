using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LP.Finance.Common.CustomValidators;

namespace LP.Finance.Common.Dtos
{
    public class JournalMetaInputDto
    {
        [Required] public string TableName { get; set; }
        [MinimumElements(1)] public List<string> Filters { get; set; }
    }
}