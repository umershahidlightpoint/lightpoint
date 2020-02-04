namespace LP.Finance.Common.Dtos
{
    public class JournalOutputDto
    {
        public string Source { get; set; }
        public string When { get; set; }
        public decimal? FxRate { get; set; }
        public string Fund { get; set; }
        public string GeneratedBy { get; set; }
        public double Quantity { get; set; }
        public string LastModifiedOn { get; set; }
        public string Event { get; set; }
        public double StartPrice { get; set; }
        public double EndPrice { get; set; }
        public int SecurityId { get; set; }
        public int CommentId { get; set; }
        public bool IsAccountTo { get; set; }
        public string Comment { get; set; }
        public JournalAccountOutputDto AccountFrom { get; set; }
        public JournalAccountOutputDto AccountTo { get; set; }
    }

    public class JournalAccountOutputDto
    {
        public int? JournalId { get; set; }
        public int? AccountId { get; set; }
        public int? AccountCategoryId { get; set; }
        public string AccountCategory { get; set; }
        public int? AccountTypeId { get; set; }
        public string AccountType { get; set; }
        public string Symbol { get; set; }
        public string FxCurrency { get; set; }
        public decimal? Value { get; set; }
        public string CreditDebit { get; set; }
    }
}