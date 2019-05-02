import * as moment from "moment";
import { CustomerInstance } from "../models/Types/Customer";
import { CustomerDTO } from "./Types/Customer";

export class CustomerMapper {
  public mapFull(array: CustomerInstance): CustomerDTO {
    return;
  }

  public async mapItem(data: CustomerInstance): Promise<CustomerDTO> {
    return await {
      id: data.id || null,
      email: data.email || null,
      name: `${data.first_name} ${data.last_name}`,
      initials: `${data.first_name[0]}${data.last_name[0]}`
    };
  }
}
