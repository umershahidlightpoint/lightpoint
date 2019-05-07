import * as moment from "moment";
import { AccountInstance } from "../models/Types/Account";
import { AccountDTO } from "./Types/Account";

export class AccountMapper {
  public mapFull(data: AccountInstance): AccountDTO {
    return;
  }

  public async mapItem(data: AccountInstance): Promise<AccountDTO> {
    return await {
      id: data.id || null,
      name: data.name || null,
      accountType: {
        id: data.accountType.id,
        name: data.accountType.name,
      }
    };
  }
}
