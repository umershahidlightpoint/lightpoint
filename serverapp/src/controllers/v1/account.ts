import { Request, Response, Router } from "express";
import { Account } from "../../models";
import { AccountService } from "../../services/account.service";
import { MapperHelper, IList } from "../../mappers/mapper.helper";
import { AccountMapper } from "../../mappers/account.mapper";
import { Helper } from "../../helpers/index";
import { IController } from "./icontroller";

export class AccountController implements IController {
  public accountService: AccountService = new AccountService();
  public mapperHelper: MapperHelper = new MapperHelper();
  public accountMapper: AccountMapper = new AccountMapper();
  public helper: Helper = new Helper();

  public getRouter(): Router {
    const router = Router();
    router.get("", this.search);
    router.post("", this.create);
    router.get("/:account_id", this.findById);
    return router;
  }

  public create = async (req: Request, res: Response) => {};

  public search = async (req: Request, res: Response) => {
    try {
      const { page, keyword, sort, sort_direction } = req.query;
      const result: Account = await this.accountService.search({
        page,
        keyword,
        sort,
        sort_direction
      });
      const mapped: IList = await this.mapperHelper.paginate(
        result,
        this.accountMapper.mapItem
      );
      return res.status(200).json(mapped);
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };

  public findById = async (req: Request, res: Response) => {};
}
