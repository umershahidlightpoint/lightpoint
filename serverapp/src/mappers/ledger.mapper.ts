import * as moment from "moment";

export interface ILedger {
  id: number;
  value: number;
  effective_date: string;
  fund: object;
  account: object;
  customer: object;
  created_at: string;
}

export interface ILedgerElement {
  id: number;
  value: number;
  effective_date: string;
  Fund: object;
  Account: object;
  Customer: object;
  created_at: string;
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
      fund: data.Fund || null,
      account: data.Account || null,
      customer: data.Customer || null,
      created_at: moment(data.created_at).fromNow() || null
    };
  }
}
