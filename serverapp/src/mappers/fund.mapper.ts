import * as moment from "moment";

export interface IFund {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export class FundMapper {
  public map(array: Array<object>): Array<object> {
    const arrayList: Array<object> = array.map(
      (element: IFund): IFund => this.mapFund(element)
    );

    return arrayList;
  }

  public mapFund(data: IFund): IFund {
    return {
      id: data.id || null,
      name: data.name || null,
      description: data.description || null,
      created_at: moment(data.created_at).fromNow() || null
    };
  }
}
