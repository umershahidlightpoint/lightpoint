export interface ILedgerForm {
  value: number;
  effective_date: Date;
  fund_id: number;
  account_id: number;
  customer_id: number;
}

export interface ISearchForm {
  page?: number | null;
  keyword?: string | null;
  sort?: string | null;
  sort_direction?: string | null;
}
