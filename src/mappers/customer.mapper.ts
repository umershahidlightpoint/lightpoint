import * as moment from "moment";

interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export class CustomerMapper {
  public map(array: Array<object>): Array<object> {
    const arrayList: Array<object> = array.map(
      (element: Customer): Customer => this.mapCustomer(element)
    );

    return arrayList;
  }

  private mapCustomer(data: Customer): Customer {
    return {
      id: data.id || null,
      email: data.email || null,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      createdAt: moment(data.createdAt).fromNow() || null
    };
  }
}
