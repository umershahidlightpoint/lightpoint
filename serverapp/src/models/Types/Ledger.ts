import { FundInstance } from "./Fund";
import { AccountInstance } from "./Account";
import { CustomerInstance } from "./Customer";
import { AccountTypeInstance } from "./AccountType";

export interface LedgerInstance {
  id: number;
  value: number;
  effective_date: Date;
  Fund: FundInstance;
  Account: AccountInstance;
  Customer: CustomerInstance;
  AccountType: AccountTypeInstance;
  create_at: Date;
  updated_at: Date;
}
