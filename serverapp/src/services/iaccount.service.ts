import { ISearchForm } from "../form/isearch.form";

export interface IAccountService {
  search(params: ISearchForm);
  findById(id: number);
}
