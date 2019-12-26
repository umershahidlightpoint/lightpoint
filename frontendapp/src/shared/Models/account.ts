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

export interface OrganizationAccount {
  accountId: number;
  accountName: string;
  description: string;
  categoryId: number;
  category: string;
  typeId: number;
  type: string;
  hasMapping: boolean;
  hasJournal: boolean;
  canDeleted: boolean;
  canEdited: boolean;
}
