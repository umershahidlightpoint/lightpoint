import { ISearchForm } from "../form/isearch.form";

export interface IFundService {
  search(params: ISearchForm);
}
