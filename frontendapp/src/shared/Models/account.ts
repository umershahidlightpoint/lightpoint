
export interface CreateAccount {
  description: string;
  type: number;
  tags: [
    {
      id: number,
      value: string
    }
  ]
}

export interface EditAccount {
  id: number;
  description: string;
  category: number;
  tags: [
    {
      id: number,
      value: string
    }
  ]
}

export interface AccountCategory {
  Id: number;
  Name: string;
}

export interface GridRowData {
  Id: number,
  Name: string,
  Description: string,
  Category: string,
  Category_Id: number,
  has_journal: string,
  Tags: [{
    Id: number,
    Value: string
  }],
  CanDeleted: boolean,
  CanEdited: boolean
}

export interface AccountTag {
  Id: number,
  Value: string
}