import { Request, Response } from "express";
import { Helper } from "../helpers/index";

export class LedgerMiddleware {
  private helper: Helper = new Helper();

  public validateCreate = (req: Request, res: Response, next) => {
    const { fund_id, account_id, customer_id } = req.body;

    if (!fund_id) {
      const mappedError = this.helper.error(400, "Fund ID is Missing");
      res.status(400).json(mappedError);
    }

    if (!account_id) {
      const mappedError = this.helper.error(400, "Account ID is Missing");
      res.status(400).json(mappedError);
    }

    if (!customer_id) {
      const mappedError = this.helper.error(400, "Customer ID is Missing");
      res.status(400).json(mappedError);
    }

    next();
  };
}
