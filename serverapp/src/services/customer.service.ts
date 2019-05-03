import { Customer } from "../models";
import { ICustomerForm } from "../form/icustomer.form";
import { ISearchForm } from "../form/isearch.form";
import { ICustomerService } from "../services/icustomer.service";
import { ServiceHelper } from "../helpers/service.helper";
import { RuntimeExceptions } from "../exceptions/runtime_exceptions";
import * as _ from "lodash";
import { Op } from "sequelize";
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
        params.sort_direction,
        "first_name",
        "ASC"
      );
      const pagination = this.serviceHelper.pagination(params.page);
      const critiera = {};
      if (!_.isEmpty(params.keyword)) {
        critiera[Op.or] = [
          { "first_name": { [Op.iLike]: `%${params.keyword}%` } },
          { "last_name": { [Op.iLike]: `%${params.keyword}%` } },
          { "email": { [Op.iLike]: `%${params.keyword}%` } },
        ];
      }
      const customers: Customer = await Customer.findAndCountAll({
        ...sorting,
        ...pagination,
        where: {
          ...critiera
        }
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

      if (!customer) {
        throw new RuntimeExceptions("Record not Found", 404);
      }

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

      if (!customer) {
        throw new RuntimeExceptions("Record not Found", 404);
      }

      return Promise.resolve(customer);
    } catch (error) {
      if (error) return Promise.reject(error);
    }
  };
}
