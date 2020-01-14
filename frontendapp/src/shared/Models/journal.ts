export interface Journal {
  Source: string;
  When: Date;
  FxCurrency: string;
  FxRate: number;
  Fund: string;
  GeneratedBy: string;
  Quantity: number;
  LastModifiedOn: Date;
  Symbol: string;
  Event: string;
  StartPrice: number;
  EndPrice: number;
  SecurityId: number;
  CommentId: number;
  Comment: string;
  AccountFrom: JournalAccount;
  AccountTo: JournalAccount;
  AccountCategory: string;
  AccountType: string;
  Modifiable: string;
}

export interface JournalAccount {
  JournalId: number;
  AccountId: number;
  Value: number;
  CreditDebit: string;
}
