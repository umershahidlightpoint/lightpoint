export interface TrialBalanceReport {
  accountName: string;
  debit: number;
  credit: number;
  debitPercentage: number;
  creditPercentage: number;
  balance: number;
}

export interface TrialBalanceReportStats {
  totalDebit: number;
  totalCredit: number;
}
