import * as moment from "moment";

export interface ICustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export class CustomerMapper {
  public mapFull(array: ICustomer): ICustomer {
    return;
  }

  public async mapItem(data: ICustomer): Promise<ICustomer> {
    return await {
      id: data.id || null,
      email: data.email || null,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      created_at: moment(data.created_at).fromNow() || null
    };
  }
}
