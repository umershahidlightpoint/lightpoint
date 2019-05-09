import { Fund, Account, AccountType, Customer } from "../models";
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
    let order = [[default_column, default_direction]];
    const sort_direction: string = sorting_direction
      ? sorting_direction
      : default_direction;
    if (sorting_column === "ledger") {
      order = [["effective_date", sort_direction]];
    }
    if (sorting_column === "fund") {
      order = [[Fund, "name", sort_direction]];
    }
    if (sorting_column === "account") {
      order = [[Account, "name", sort_direction]];
    }
    if (sorting_column === "customer") {
      order = [[Customer, "first_name", sort_direction]];
    }
    if (sorting_column === "account_type") {
      order = [[Account, "accountType", "name", sort_direction]];
    }
    return {
      order
    };
  }

  public meta(total: number, pageNumber: number, limit: number): Meta {
    const page: number = Number(pageNumber) ? Number(pageNumber) : 1;
    const pages: number = Math.ceil(total / limit);
    const next: number | string = page < pages ? page + 1 : "none";
    return {
      total,
      pages,
      limit,
      page,
      next
    };
  }
}
