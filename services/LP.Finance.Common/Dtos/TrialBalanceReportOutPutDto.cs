﻿namespace LP.Finance.Common.Dtos
{
    public class TrialBalanceReportOutPutDto
    {
        public string AccountType { get; set; }
        public string AccountName { get; set; }
        public string AccountCategory { get; set; }

        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public decimal? DebitPercentage { get; set; }
        public decimal? CreditPercentage { get; set; }
        public decimal? Balance { get; set; }

    }
}