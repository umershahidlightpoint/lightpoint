import { AccountTypeDTO } from "./AccountType";
import { RecordDTO } from "./Record";
/**
 *
 */
export interface AccountDTO extends RecordDTO {
  accountType: AccountTypeDTO;
  parent?: AccountDTO;
  description?: string;
}
