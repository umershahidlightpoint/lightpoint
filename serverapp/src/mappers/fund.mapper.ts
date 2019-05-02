import * as moment from "moment";

export interface IFund {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export class FundMapper {
  public mapFull(array: IFund): IFund {
    return;
  }

  public async mapItem(data: IFund): Promise<IFund> {
    return await {
      id: data.id || null,
      name: data.name || null,
      description: data.description || null,
      created_at: moment(data.created_at).fromNow() || null
    };
  }
}
