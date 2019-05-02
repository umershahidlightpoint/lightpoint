import { Application, Request, Response, Router } from "express";
import {
  BASE_FUNDS_ROUTE,
  BASE_LEDGERS_ROUTE,
  BASE_CUSTOMERS_ROUTE
} from "./base-route";
import { CustomerController } from "../controllers/v1/customer";
import { FundController } from "../controllers/v1/fund";
import { LedgerController } from "../controllers/v1/ledger";
import { AccountController } from "../controllers/v1/account";
import { LedgerMiddleware } from "../middlewares/ledger.middleware";

export class Routes {
  public customerController: CustomerController = new CustomerController();
  public fundController: FundController = new FundController();
  public ledgerController: LedgerController = new LedgerController();
  public accountController: AccountController = new AccountController();

  public getRoutes(): Router {
    const apiRouter = Router();
    apiRouter.get("", (req: Request, res: Response) => {
      return res.json({ m: "Welcome Finance API" });
    });

    apiRouter.use("/customers", this.customerController.getRouter());
    apiRouter.use("/funds", this.fundController.getRouter());
    apiRouter.use("/ledgers", this.ledgerController.getRouter());
    apiRouter.use("/accounts", this.accountController.getRouter());
    return apiRouter;
  }
}
