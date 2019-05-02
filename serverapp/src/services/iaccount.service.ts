import { ISearchForm } from "../form/iaccount.form";

export interface IAccountService {
  search(params: ISearchForm);
  findById(id: number);
}
