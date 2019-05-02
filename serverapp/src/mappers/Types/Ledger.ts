import { FundDTO } from "./Fund";
import { AccountDTO } from "./Account";
import { CustomerDTO } from "./Customer";
import { RecordDTO } from "./Record";

export interface LedgerDTO {
  id: number;
  value: number;
  effective_date: Date;
  fund: RecordDTO;
  account: RecordDTO;
  customer: RecordDTO;
  create_at?: Date;
  updated_at?: Date;
}
