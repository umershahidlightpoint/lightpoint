import { Fund } from "../models";
import { ISearchForm } from "../form/isearch.form";
import { IFundService } from "../services/ifund.service";
import { ServiceHelper } from "../helpers/service.helper";

interface IList {
  data: Array<Fund>;
  meta: object;
}

export class FundService implements IFundService {
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

      const funds: Fund = await Fund.findAndCountAll({
        ...sorting,
        ...pagination
      });

      const meta = this.serviceHelper.meta(
        funds.count,
        params.page,
        pagination.limit
      );

      result.data = funds.rows;
      result.meta = meta;
      return Promise.resolve(result);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };
}
