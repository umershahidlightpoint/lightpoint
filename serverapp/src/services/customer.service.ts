import * as Sequelize from "sequelize";
import { Customer } from "../models";
import { ICustomerForm, ISearchForm } from "../form/icustomer.form";
import { ICustomerService } from "../services/icustomer.service";
import { ServiceHelper } from "../helpers/service.helper";

interface IList {
  data: Array<Customer>;
  meta: object;
}

export class CustomerService implements ICustomerService {
  public serviceHelper: ServiceHelper = new ServiceHelper();

  public create = async (input: ICustomerForm): Promise<Customer> => {
    try {
      const customer: Customer = await Customer.create(input);

      return Promise.resolve(customer);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public search = async (params: ISearchForm): Promise<IList> => {
    try {
      const result: IList = { data: [], meta: {} };
      const keyword: string = params.keyword ? params.keyword : "";
      const sorting = this.serviceHelper.sorting(
        params.sort,
        params.sort_direction
      );
      const pagination = this.serviceHelper.pagination(params.page);

      const customers: Customer = await Customer.findAndCountAll({
        ...sorting,
        ...pagination
      });

      const meta = this.serviceHelper.meta(
        customers.count,
        params.page,
        pagination.limit
      );
      result.data = customers.rows;
      result.meta = meta;
      return Promise.resolve(result);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public findById = async (id: number): Promise<Customer> => {
    try {
      const customer: Customer = await Customer.findByPk(id);
      return Promise.resolve(customer);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };

  public findByEmail = async (email: string): Promise<Customer> => {
    try {
      const customer: Customer = await Customer.findOne({
        where: { email }
      });

      return Promise.resolve(customer);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };
}
