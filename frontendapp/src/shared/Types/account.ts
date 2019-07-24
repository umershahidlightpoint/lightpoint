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
  name: string;
  description: string;
  category: number;
}

export interface AccountCategory {
  id: number;
  name: string;
}