import { ILedgerForm, ISearchForm } from "../form/iledger.form";

export interface ILedgerService {
  create(input: ILedgerForm);
  search(params: ISearchForm);
  findById(id: number);
}
