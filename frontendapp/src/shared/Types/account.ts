export interface Account {
  name: string;
  description: string;
  category: number;
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