using System;
using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.Dtos
{
    public class JournalInputDto
    {
        [Required] public string Fund { get; set; }
        [Required] public JournalAccountInputDto AccountFrom { get; set; }
        [Required] public JournalAccountInputDto AccountTo { get; set; }
        [Required] public double Value { get; set; }
        [Required] public DateTime AsOf { get; set; }
        public int CommentId { get; set; }
        [Required] public string Comments { get; set; }
        public bool ContraEntryMode { get; set; } = false;
    }
}