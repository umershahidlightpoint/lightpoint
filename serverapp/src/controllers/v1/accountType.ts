import { Request, Response, Router } from "express";
import { AccountType } from "../../models";
import { AccountTypeService } from "../../services/accounttype.service";
import { MapperHelper, IList } from "../../mappers/mapper.helper";
import { AccountTypeMapper } from "../../mappers/accounttype.mapper";
import { Helper } from "../../helpers/index";
import { IController } from "./icontroller";

export class AccountTypeController implements IController {
  public accountTypeService: AccountTypeService = new AccountTypeService();
  public mapperHelper: MapperHelper = new MapperHelper();
  public accountTypeMapper: AccountTypeMapper = new AccountTypeMapper();
  public helper: Helper = new Helper();

  public getRouter(): Router {
    const router = Router();
    router.get("", this.search);
    return router;
  }

  public search = async (req: Request, res: Response) => {
    try {
      const { page, keyword, sort, sort_direction } = req.query;
      const result: AccountType = await this.accountTypeService.search({
        page,
        keyword,
        sort,
        sort_direction
      });
      const mapped: IList = await this.mapperHelper.paginate(
        result,
        this.accountTypeMapper.mapItem
      );
      return res.status(200).json(mapped);
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };
}
