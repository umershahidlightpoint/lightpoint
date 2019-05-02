import { Application, Request, Response, Router } from "express";
import {
  BASE_FUNDS_ROUTE,
  BASE_LEDGERS_ROUTE,
  BASE_CUSTOMERS_ROUTE
} from "./base-route";
import { CustomerController } from "../controllers/customer";
import { FundController } from "../controllers/fund";
import { LedgerController } from "../controllers/v1/ledger";
import { LedgerMiddleware } from "../middlewares/ledger.middleware";

export class Routes {
  public customerController: CustomerController = new CustomerController();
  public fundController: FundController = new FundController();
  public ledgerController: LedgerController = new LedgerController();

  public getRoutes(): Router {
    const apiRouter = Router();
    apiRouter.get("", (req: Request, res: Response) => {
      return res.json({ "m": "Welcome Finance API" });
    });
    apiRouter.use("/customers", this.customerController.getRoutes());
    //apiRouter.use("/funds");
    //apiRouter.use("/ledgers");
    //apiRouter.use("/accounts");
    return apiRouter;
  }

  public routes(app: Application): void {
    /*
      app.route("/").get((req: Request, res: Response) => {
        res.status(200).send({
          message: "TypeScript App API"
        });
      });
  
      app.route(BASE_CUSTOMERS_ROUTE).post(this.customerController.create);
  
      app.route(BASE_CUSTOMERS_ROUTE).get(this.customerController.search);
  
      app
        .route(`${BASE_CUSTOMERS_ROUTE}/email`)
        .get(this.customerController.findByEmail);
  
      app
        .route(`${BASE_CUSTOMERS_ROUTE}/:customer_id`)
        .get(this.customerController.findById);
  
      app.route(BASE_FUNDS_ROUTE).get(this.fundController.search);
  
      app.route(BASE_LEDGERS_ROUTE).post(this.ledgerController.create);
  
      app.route(BASE_LEDGERS_ROUTE).get(this.ledgerController.search);
  
      app
        .route(`${BASE_LEDGERS_ROUTE}/:ledger_id`)
        .get(this.ledgerController.findById);
        */
  }
}
