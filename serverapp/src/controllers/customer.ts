import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { CustomerMapper } from "../mappers/customer.mapper";
import { Helper } from "../helpers/index";

export class CustomerController {
  public customerService: CustomerService = new CustomerService();
  public customerMapper: CustomerMapper = new CustomerMapper();
  public helper: Helper = new Helper();

  public getCustomers = async (req: Request, res: Response) => {
    try {
      const result: Array<object> = await this.customerService.findAll();
      const mappedFeed: Array<object> = this.customerMapper.map(result);

      return res
        .status(200)
        .send(
          this.helper.success(
            200,
            "Customers Retrieved Successfully.",
            mappedFeed,
            null
          )
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };
}
