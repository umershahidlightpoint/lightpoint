import { IServiceHelper, Pagination, Sorting, Meta } from "./iservice.helper";

export class ServiceHelper implements IServiceHelper {
  public pagination(pageNumber: number): Pagination {
    const page: number = Number(pageNumber) ? Number(pageNumber) : 1;
    const limit: number = 40;
    const offset: number = limit * (page - 1);
    return {
      limit,
      offset
    };
  }

  public sorting(
    sorting_column: string,
    sorting_direction: string,
    default_column: string,
    default_direction: string
  ): Sorting {
    const sort: string = sorting_column ? sorting_column : default_column;
    const sort_direction: string = sorting_direction
      ? sorting_direction
      : default_direction;
    return {
      order: [[sort, sort_direction]]
    };
  }

  public meta(total: number, pageNumber: number, pageLimit: number): Meta {
    const page = Number(pageNumber) ? Number(pageNumber) : 1;
    const pages: number = Math.ceil(total / pageLimit);
    const next = page < pages ? page + 1 : null;
    return {
      total,
      pages,
      limit: pageLimit,
      page,
      next
    };
  }
}
