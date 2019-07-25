export interface CreateAccount {
  description: string;
  category: number;
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
  id: number;
  name: string;
}