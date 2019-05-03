import { ISearchForm } from "./isearch.form";

export interface ILedgerSearchForm extends ISearchForm {
  fund_id?: number | null;
  account_id?: number | null;
  customer_id?: number | null;
}
