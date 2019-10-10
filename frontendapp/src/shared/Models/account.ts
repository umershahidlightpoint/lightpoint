export interface CreateAccount {
  description: string;
  type: number;
  tags: [
    {
      id: number;
      value: string;
    }
  ];
}

export interface EditAccount {
  id: number;
  description: string;
  type: number;
  tags: [
    {
      id: number;
      value: string;
    }
  ];
}

export interface AccountCategory {
  id: number;
  name: string;
}

export interface Account {
  accountId: number;
  name: string;
  description: string;
  category: string;
  type: string;
  typeId: number;
  categoryId: number;
  hasJournal: string;
  Tags: [
    {
      Id: number;
      Value: string;
    }
  ];
  canDeleted: boolean;
  canEdited: boolean;
}

export interface AccountTag {
  Id: number;
  Value: string;
}

export interface Fund {
  fundId: number;
  fundCode: string;
}

export class LedgerInput {
  value: number | undefined;
  customer_id: string | undefined;
  account_id: string | undefined;
  fund_id: string | undefined;
  effectiveDate: any | undefined;
}
