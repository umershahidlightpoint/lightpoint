export interface TrialBalanceReport {
  accountName: string;
  debit: number;
  credit: number;
  debitPercentage: number;
  creditPercentage: number;
}

export interface TrialBalanceReportStats {
  totalDebit: number;
  totalCredit: number;
}
