import { Request, Response, Router } from "express";
import { ICustomerForm, ISearchForm } from "../form/icustomer.form";
import { CustomerService } from "../services/customer.service";
import { Customer } from "../models";
import { MapperHelper, IList } from "../mappers/mapper.helper";
import { CustomerMapper, ICustomer } from "../mappers/customer.mapper";
import { Helper } from "../helpers/index";

export class CustomerController {
  public customerService: CustomerService = new CustomerService();
  public mapperHelper: MapperHelper = new MapperHelper();
  public customerMapper: CustomerMapper = new CustomerMapper();
  public helper: Helper = new Helper();

  public getRoutes(): Router {
    const router = Router();
    router.get("", this.search);
    router.post("", this.create);
    router.get("/:customer_id", this.findById);
    return router;
  }


  public create = async (req: Request, res: Response) => {
    try {
      const { first_name, last_name, email }: ICustomerForm = req.body;
      const result: Customer = await this.customerService.create({
        first_name,
        last_name,
        email
      });
      const mappedFeed: ICustomer = await this.customerMapper.mapItem(result);

      return res
        .status(200)
        .send(
          this.helper.success(200, "Customer Created Successfully.", mappedFeed)
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  public search = async (req: Request, res: Response) => {
    try {
      const { page, keyword, sort, sort_direction } = req.query;
      const result: Customer = await this.customerService.search({
        page,
        keyword,
        sort,
        sort_direction
      });
      const mappedFeed: IList = await this.mapperHelper.paginate(
        result,
        this.customerMapper.mapItem
      );

      return res
        .status(200)
        .send(
          this.helper.success(
            200,
            "Customers Found Successfully.",
            mappedFeed,
            result.meta
          )
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  public findById = async (req: Request, res: Response) => {
    try {
      const id: number = req.params.customer_id;
      const result: Customer = await this.customerService.findById(id);
      const mappedFeed: ICustomer = await this.customerMapper.mapItem(result);

      return res
        .status(200)
        .send(
          this.helper.success(200, "Customer Found Successfully.", mappedFeed)
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  public findByEmail = async (req: Request, res: Response) => {
    try {
      const email: string = req.query.email;
      const result: Customer = await this.customerService.findByEmail(email);
      const mappedFeed: ICustomer = await this.customerMapper.mapItem(result);

      return res
        .status(200)
        .send(
          this.helper.success(200, "Customer Found Successfully.", mappedFeed)
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };
}
