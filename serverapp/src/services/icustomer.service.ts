import { ICustomerForm, ISearchForm } from "../form/icustomer.form";

export interface ICustomerService {
  create(input: ICustomerForm);
  search(params: ISearchForm);
  findById(id: number);
  findByEmail(email: string);
}
