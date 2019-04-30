interface Pagination {
  limit: number;
  offset: number;
}

interface Sorting {
  order: Array<Array<string>>;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  next: number;
  pages: number;
}

export class ServiceHelper {
  public pagination(pageNumber: number): Pagination {
    const page: number = Number(pageNumber) ? Number(pageNumber) : 1;
    const limit: number = 10;
    const offset: number = limit * (page - 1);
    return {
      limit,
      offset
    };
  }

  public sorting(sorting: string, sorting_direction: string): Sorting {
    const sort: string = sorting ? sorting : "first_name";
    const sort_direction: string = sorting_direction
      ? sorting_direction
      : "ASC";
    return {
      order: [[sort, sort_direction]]
    };
  }

  public meta(count: number, pageNumber: number, pageLimit: number): Meta {
    const pages: number = Math.ceil(count / pageLimit);
    const next = Number(pageNumber) < pages ? Number(pageNumber) + 1 : null;
    return {
      total: count,
      page: pageNumber,
      limit: pageLimit,
      next,
      pages
    };
  }
}
