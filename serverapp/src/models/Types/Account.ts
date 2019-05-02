import { AccountTypeInstance } from "./AccountType";

export interface AccountInstance {
  id: number;
  name: string;
  accountType: AccountTypeInstance;
  parent: AccountInstance;
  description: string;
  create_at: Date;
  updated_at: Date;
}
