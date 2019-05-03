import { Request, Response, Router } from "express";
import { ILedgerForm } from "../../form/iledger.form";
import { LedgerService } from "../../services/ledger.service";
import { Ledger } from "../../models";
import { MapperHelper, IList } from "../../mappers/mapper.helper";
import { LedgerMapper } from "../../mappers/ledger.mapper";
import { Helper } from "../../helpers/index";
import { IController } from "./icontroller";

export class LedgerController implements IController {
  private ledgerService: LedgerService = new LedgerService();
  private mapperHelper: MapperHelper = new MapperHelper();
  private ledgerMapper: LedgerMapper = new LedgerMapper();
  private helper: Helper = new Helper();

  public getRouter(): Router {
    const apiRouter = Router();
    apiRouter.get("", async (req: Request, res: Response) =>
      this.search(req, res)
    );
    apiRouter.post("", async (req: Request, res: Response) =>
      this.create(req, res)
    );
    apiRouter.put("", async (req: Request, res: Response) =>
      this.edit(req, res)
    );
    apiRouter.get("/:ledger_id", async (req: Request, res: Response) =>
      this.findById(req, res)
    );
    return apiRouter;
  }

  private create = async (req: Request, res: Response) => {
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
      const mappedFeed: Ledger = await this.ledgerMapper.mapItem(result);

      return res.status(200).json(mappedFeed);
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  private edit = async (req: Request, res: Response) => {
    try {
      const {
        id,
        value,
        effective_date,
        fund_id,
        account_id,
        customer_id
      }: ILedgerForm = req.body;
      const result: Ledger = await this.ledgerService.edit({
        id,
        value,
        effective_date,
        fund_id,
        account_id,
        customer_id
      });
      const mappedFeed: Ledger = await this.ledgerMapper.mapItem(result);

      return res.status(200).json(mappedFeed);
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  private search = async (req: Request, res: Response) => {
    try {
      const {
        page,
        keyword,
        sort,
        sort_direction,
        fund_id,
        account_id,
        customer_id
      } = req.query;
      const result: Ledger = await this.ledgerService.search({
        page,
        keyword,
        sort,
        sort_direction,
        fund_id,
        account_id,
        customer_id
      });
      const mapped: IList = await this.mapperHelper.paginate(
        result,
        this.ledgerMapper.mapItem
      );

      return res.status(200).json(mapped);
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  private findById = async (req: Request, res: Response) => {
    try {
      const id: number = req.params.ledger_id;
      const result: Ledger = await this.ledgerService.findById(id);
      const mappedFeed: Ledger = await this.ledgerMapper.mapItem(result);

      return res.status(200).json(mappedFeed);
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };
}
