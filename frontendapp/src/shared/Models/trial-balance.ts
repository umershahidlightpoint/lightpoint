export interface TrialBalanceReport {
  accountCategory?: string;
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
