export interface Pagination {
  limit: number;
  offset: number;
}

export interface Sorting {
  order: Array<Array<string>>;
}

export interface Meta {
  total: number;
  pages: number;
  limit: number;
  page: number;
  next: number;
}

export interface IServiceHelper {
  pagination(pageNumber: number): Pagination;
  sorting(
    sorting_column: string,
    sorting_direction: string,
    default_column: string,
    default_direction: string
  ): Sorting;
  meta(total: number, pageNumber: number, pageLimit: number): Meta;
}
