import { Customer } from "../models";

export class CustomerService {
  public findAll = async (): Promise<Array<object>> => {
    try {
      const customers: Array<object> = await Customer.findAll();

      return Promise.resolve(customers);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public create = async (): Promise<object> => {
    try {
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };
}
