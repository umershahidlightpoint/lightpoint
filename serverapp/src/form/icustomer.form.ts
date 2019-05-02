export interface ICustomerForm {
  first_name: string;
  last_name: string;
  email: string;
}

export interface ISearchForm {
  page?: number | null;
  keyword?: string | null;
  sort?: string | null;
  sort_direction?: string | null;
}
