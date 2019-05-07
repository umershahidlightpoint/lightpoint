import { AccountType, Account } from "../models";
import { ISearchForm } from "../form/isearch.form";
import { IAccountTypeService } from "./iaccounttype.service";
import { ServiceHelper } from "../helpers/service.helper";
import { RuntimeExceptions } from "../exceptions/runtime_exceptions";
import { Op } from "sequelize";
import * as _ from "lodash";

interface IList {
  data: Array<AccountType>;
  meta: object;
}

export class AccountTypeService implements IAccountTypeService {
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
      const critiera = {};
      if (!_.isEmpty(params.keyword)) {
        critiera["name"] = { [Op.iLike]: `%${params.keyword}%` };
      }
      const accountTypes: AccountType = await AccountType.findAndCountAll({
        ...sorting,
        ...pagination,
        where: {
          ...critiera
        },
        include: [{ model: Account }]
      });

      const meta = this.serviceHelper.meta(
        accountTypes.count,
        params.page,
        pagination.limit
      );

      result.data = accountTypes.rows;
      result.meta = meta;
      return Promise.resolve(result);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };
}
