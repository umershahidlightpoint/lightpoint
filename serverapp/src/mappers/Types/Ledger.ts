import { FundDTO } from "./Fund";
import { AccountDTO } from "./Account";
import { CustomerDTO } from "./Customer";
import { RecordDTO } from "./Record";

export interface LedgerDTO {
  id: number;
  value: number;
  effectiveDate: string;
  fund: RecordDTO;
  account: RecordDTO;
  customer: RecordDTO;
  accountType: RecordDTO;
  create_at?: Date;
  updated_at?: Date;
}

export interface GroupedLedgerDTO {
  id: number;
  name: string;
  value: number;
}
