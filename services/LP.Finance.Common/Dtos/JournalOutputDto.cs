using System.Collections.Generic;

namespace LP.Finance.Common.Dtos
{
    public class JournalOutputDto
    {
        public string Source { get; set; }
        public string When { get; set; }
        public string FxCurrency { get; set; }
        public decimal? FxRate { get; set; }
        public string Fund { get; set; }
        public string GeneratedBy { get; set; }
        public List<JournalAccountOutputDto> JournalAccounts { get; set; }
    }

    public class JournalAccountOutputDto
    {
        public int? JournalId { get; set; }
        public int? AccountFromId { get; set; }
        public int? AccountToId { get; set; }
        public decimal? Value { get; set; }
    }
}