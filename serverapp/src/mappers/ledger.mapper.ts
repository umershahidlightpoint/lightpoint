import { LedgerInstance } from "../models/Types/Ledger";
import { LedgerDTO, GroupedLedgerDTO } from "./Types/Ledger";
import * as moment from "moment";

export class LedgerMapper {
  public mapFull(data: LedgerInstance): LedgerDTO {
    return;
  }

  public async mapItem(data: LedgerInstance): Promise<LedgerDTO> {
    return await {
      id: data.id || null,
      value: data.value || null,
      effectiveDate: moment(data.effective_date).format("YYYY-MM-DD"),
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
        name: `${data.Customer.first_name} ${data.Customer.last_name}`
      }
    };
  }

  public async mapGroupedItem(data: LedgerInstance): Promise<GroupedLedgerDTO> {
    if (data["Account"]) {
      return await {
        id: data.Account.id || null,
        name: data.Account.name || null,
        value: data.value || null
      };
    }
    if (data["Customer"]) {
      return await {
        id: data.Customer.id || null,
        name: `${data.Customer.first_name} ${data.Customer.last_name}` || null,
        value: data.value || null
      };
    }
    if (data["Account.account_type_id"]) {
      return await {
        id: data["Account.account_type_id"] || null,
        name: data["AccountType.name"] || null,
        value: data.value || null
      };
    }
  }
}
