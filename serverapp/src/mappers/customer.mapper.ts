import * as moment from "moment";

export interface ICustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export class CustomerMapper {
  public map(array: Array<object>): Array<object> {
    const arrayList: Array<object> = array.map(
      (element: ICustomer): ICustomer => this.mapCustomer(element)
    );

    return arrayList;
  }

  public mapCustomer(data: ICustomer): ICustomer {
    return {
      id: data.id || null,
      email: data.email || null,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      created_at: moment(data.created_at).fromNow() || null
    };
  }
}
