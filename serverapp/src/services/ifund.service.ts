import { ISearchForm } from "../form/ifund.form";

export interface IFundService {
  search(params: ISearchForm);
}
