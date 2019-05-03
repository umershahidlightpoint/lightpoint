import * as moment from "moment";
import { LedgerInstance } from "../models/Types/Ledger";
import { LedgerDTO } from "./Types/Ledger";

export class LedgerMapper {
  public mapFull(data: LedgerInstance): LedgerDTO {
    return;
  }

  public async mapItem(data: LedgerInstance): Promise<LedgerDTO> {
    return await {
      id: data.id || null,
      value: data.value || null,
      effectiveDate: data.effective_date || null,
      fund: {
        id: data.Fund.id,
        name: data.Fund.name
      },
      account: {
        id: data.Account.id,
        name: data.Account.name
      },
      accountType: {
        id: data.Account.accountType.id,
        name: data.Account.accountType.name
      },
      customer: {
        id: data.Customer.id,
        name: `${data.Customer.first_name}`
      }
    };
  }
}
