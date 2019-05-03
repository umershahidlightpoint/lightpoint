import { ICustomerForm } from "../form/icustomer.form";
import { ISearchForm } from "../form/isearch.form";

export interface ICustomerService {
  create(input: ICustomerForm);
  search(params: ISearchForm);
  findById(id: number);
  findByEmail(email: string);
}
