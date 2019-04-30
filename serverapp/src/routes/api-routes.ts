import { Application, Request, Response } from "express";
import { BASE_CUSTOMERS_ROUTE } from "./base-route";
import { CustomerController } from "../controllers/customer";
import { Fund, AccountType, Customer } from "../models";
import * as faker from "faker";

export class Routes {
  public customerController: CustomerController = new CustomerController();

  public routes(app: Application): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "TypeScript App API"
      });
    });

    app
      .route(`${BASE_CUSTOMERS_ROUTE}/seedFunds`)
      .get((req: Request, res: Response) => {
        const funds = ["Q1-2018", "Q2-2018", "Q3-2018", "Q4-2018", "Q1-2019"];
        funds.forEach(async fund => {
          const fundRow = await Fund.create({
            name: fund,
            description: faker.lorem.sentence()
          });
        });

        res.send({ message: "Funds Seeded" });
      });

    app
      .route(`${BASE_CUSTOMERS_ROUTE}/seedCustomers`)
      .get(async (req: Request, res: Response) => {
        for (let i = 0; i < 20; i++) {
          const customerObject = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          };

          const customer = await Customer.create(customerObject);
        }

        res.send({ message: "Customers Seeded" });
      });

    app.route(BASE_CUSTOMERS_ROUTE).get(this.customerController.getCustomers);
  }
}
