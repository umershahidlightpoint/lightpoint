import { Request, Response } from "express";
import { Helper } from "../helpers/index";
import { ILedgerForm } from "../form/iledger.form";
import moment = require("moment");

export class LedgerMiddleware {
  private helper: Helper = new Helper();
  private dateFormat: string = "YYYY-MM-DD";

  public validate = (req: Request, res: Response, next) => {
    const {
      value,
      effectiveDate,
      fund_id,
      account_id,
      customer_id
    }: ILedgerForm = req.body;

    if (!value) {
      const mappedError = this.helper.error(400, "Value is Missing");
      return res.status(400).json(mappedError);
    }

    if (isNaN(value)) {
      const mappedError = this.helper.error(400, "Value is not Valid");
      return res.status(400).json(mappedError);
    }

    if (!effectiveDate) {
      const mappedError = this.helper.error(400, "Effective Date is Missing");
      return res.status(400).json(mappedError);
    }

    if (!moment(effectiveDate, this.dateFormat, true).isValid()) {
      const mappedError = this.helper.error(400, "Effective Date is not Valid");
      return res.status(400).json(mappedError);
    }

    if (!fund_id) {
      const mappedError = this.helper.error(400, "Fund ID is Missing");
      return res.status(400).json(mappedError);
    }

    if (!account_id) {
      const mappedError = this.helper.error(400, "Account ID is Missing");
      return res.status(400).json(mappedError);
    }

    if (!customer_id) {
      const mappedError = this.helper.error(400, "Customer ID is Missing");
      return res.status(400).json(mappedError);
    }

    next();
  };
}
