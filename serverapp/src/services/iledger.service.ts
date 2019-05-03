import { ILedgerForm } from "../form/iledger.form";
import { ISearchForm } from "../form/isearch.form";

export interface ILedgerService {
  create(input: ILedgerForm);
  search(params: ISearchForm);
  findById(id: number);
}
