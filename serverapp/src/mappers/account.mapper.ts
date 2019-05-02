import * as moment from "moment";

export interface IAccount {
  id: number;
  name: string;
  account_type: object;
}

export interface IAccountElement {
  id: number;
  name: string;
  AccountType: object;
  Account: object;
}

export class AccountMapper {
  public mapFull(item: IAccountElement): IAccount {
    return;
  }

  public async mapItem(data: IAccountElement): Promise<IAccount> {
    return await {
      id: data.id || null,
      name: data.name || null,
      account_type: data.AccountType || null
    };
  }
}
