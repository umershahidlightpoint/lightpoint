import { AccountType, Account } from "../models";
import { ISearchForm } from "../form/iaccount.form";
import { IAccountService } from "../services/iaccount.service";
import { ServiceHelper } from "../helpers/service.helper";
import { RuntimeExceptions } from "../exceptions/runtime_exceptions";

interface IList {
  data: Array<Account>;
  meta: object;
}

export class AccountService implements IAccountService {
  public serviceHelper: ServiceHelper = new ServiceHelper();

  public search = async (params: ISearchForm): Promise<IList> => {
    try {
      const result: IList = { data: [], meta: {} };
      const keyword: string = params.keyword ? params.keyword : "";
      const sorting = this.serviceHelper.sorting(
        params.sort,
        params.sort_direction,
        "name",
        "ASC"
      );
      const pagination = this.serviceHelper.pagination(params.page);

      const accounts: Account = await Account.findAndCountAll({
        ...sorting,
        ...pagination,
        include: [{ model: AccountType, as: "accountType" }]
      });

      const meta = this.serviceHelper.meta(
        accounts.count,
        params.page,
        pagination.limit
      );

      result.data = accounts.rows;
      result.meta = meta;
      return Promise.resolve(result);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public findById = async (id: number): Promise<Account> => {};
}
