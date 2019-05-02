import * as moment from "moment";

export interface ICustomer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
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
      firstName: data.first_name || null,
      lastName: data.last_name || null,
      name: `${data.first_name} ${data.last_name}`,
      initials: `${data.first_name[0].toLow}`;
      created_at: moment(data.created_at).fromNow() || null
    };
  }
}
