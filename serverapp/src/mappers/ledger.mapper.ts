import * as moment from "moment";

export interface ILedger {
  id: number;
  value: number;
  effective_date: string;
  fund: IFund;
  account: IAccount;
  customer: ICustomer;
  created_at: string;
}

export interface ILedgerElement {
  id: number;
  value: number;
  effective_date: string;
  Fund: IFund;
  Account: IAccount;
  Customer: ICustomer;
  created_at: string;
}

export interface IFund {
  id: number;
  name: string;
}

export interface IAccount {
  id: number;
  name: string;
}

export interface ICustomer {
  id: number;
  first_name: string;
  firs: string;
}

export class LedgerMapper {
  public mapFull(item: ILedgerElement): ILedger {
    return;
  }

  public async mapItem(data: ILedgerElement): Promise<ILedger> {
    return await {
      id: data.id || null,
      value: data.value || null,
      effective_date: data.effective_date || null,
      fund: {
        id: data.Fund.id,
        name: data.Fund.name
      },
      account: {
        id: data.Account.id,
        name: data.Account.name
      },
      customer: {
        id: data.Customer.id,
        name: `${data.Customer.first_name}`
      },
      created_at: moment(data.created_at).fromNow() || null
    };
  }
}
