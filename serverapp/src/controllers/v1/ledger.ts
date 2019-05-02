import { Request, Response, Router } from "express";
import { ILedgerForm } from "../../form/iledger.form";
import { LedgerService } from "../../services/ledger.service";
import { Ledger } from "../../models";
import { MapperHelper, IList } from "../../mappers/mapper.helper";
import { LedgerMapper, ILedger } from "../../mappers/ledger.mapper";
import { Helper } from "../../helpers/index";

export class LedgerController {
  private ledgerService: LedgerService = new LedgerService();
  private mapperHelper: MapperHelper = new MapperHelper();
  private ledgerMapper: LedgerMapper = new LedgerMapper();
  private helper: Helper = new Helper();

  public getRouter(): Router {
    const apiRouter = Router();
    apiRouter.get("", async (req: Request, res: Response) => this.search(req, res));
    return apiRouter;
  }


  public create = async (req: Request, res: Response) => {
    try {
      const {
        value,
        effective_date,
        fund_id,
        account_id,
        customer_id
      }: ILedgerForm = req.body;
      const result: Ledger = await this.ledgerService.create({
        value,
        effective_date,
        fund_id,
        account_id,
        customer_id
      });
      const mappedFeed: ILedger = await this.ledgerMapper.mapItem(result);

      return res
        .status(200)
        .send(
          this.helper.success(200, "Ledger Created Successfully.", mappedFeed)
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  private search = async (req: Request, res: Response) => {
    try {
      const { page, keyword, sort, sort_direction } = req.query;
      const result: Ledger = await this.ledgerService.search({
        page,
        keyword,
        sort,
        sort_direction
      });
      const mappedFeed: IList = await this.mapperHelper.paginate(
        result,
        this.ledgerMapper.mapItem
      );

      return res
        .status(200)
        .send(
          this.helper.success(200, "Ledgers Found Successfully.", mappedFeed)
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  public findById = async (req: Request, res: Response) => {
    try {
      const id: number = req.params.ledger_id;
      const result: Ledger = await this.ledgerService.findById(id);
      const mappedFeed: ILedger = await this.ledgerMapper.mapItem(result);

      return res
        .status(200)
        .send(
          this.helper.success(200, "Ledger Found Successfully.", mappedFeed)
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };
}
