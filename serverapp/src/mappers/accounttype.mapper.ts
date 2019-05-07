import * as moment from "moment";
import { AccountTypeInstance } from "../models/Types/AccountType";
import { AccountTypeDTO } from "./Types/AccountType";

export class AccountTypeMapper {
  public mapFull(data: AccountTypeInstance): AccountTypeDTO {
    return;
  }

  public async mapItem(data: AccountTypeInstance): Promise<AccountTypeDTO> {
    return await {
      id: data.id || null,
      name: data.name || null
    };
  }
}
