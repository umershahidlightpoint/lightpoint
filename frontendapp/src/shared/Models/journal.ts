export interface Journal {
  Source: string;
  When: Date;
  FxRate: number;
  Fund: string;
  GeneratedBy: string;
  Quantity: number;
  LastModifiedOn: Date;
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
  AccountCategoryId: number;
  AccountCategory: string;
  AccountTypeId: number;
  AccountType: string;
  Symbol: string;
  FxCurrency: string;
  Value: number;
  CreditDebit: string;
}
