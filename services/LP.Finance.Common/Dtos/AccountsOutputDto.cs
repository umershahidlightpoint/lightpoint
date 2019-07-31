namespace LP.Finance.Common.Dtos
{
    public class AccountsOutputDto
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public string Description { get; set; }
        public int? TypeId { get; set; }
        public string Type { get; set; }
        public int? CategoryId { get; set; }
        public string Category { get; set; }
        public string HasJournal { get; set; }
        public bool CanDeleted { get; set; }
        public bool CanEdited { get; set; }
    }
}