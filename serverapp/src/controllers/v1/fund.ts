import { Request, Response, Router } from "express";
import { FundService } from "../../services/fund.service";
import { Fund } from "../../models";
import { MapperHelper, IList } from "../../mappers/mapper.helper";
import { FundMapper, IFund } from "../../mappers/fund.mapper";
import { Helper } from "../../helpers/index";
import { IController } from "./icontroller";

export class FundController implements IController {
  private fundService: FundService = new FundService();
  private mapperHelper: MapperHelper = new MapperHelper();
  private fundMapper: FundMapper = new FundMapper();
  private helper: Helper = new Helper();

  public getRouter(): Router {
    const router = Router();
    router.get("", this.search);
    return router;
  }

  private search = async (req: Request, res: Response) => {
    try {
      const { page, keyword, sort, sort_direction } = req.query;
      const result: Fund = await this.fundService.search({
        page,
        keyword,
        sort,
        sort_direction
      });
      const mapped = await this.mapperHelper.paginate(
        result,
        this.fundMapper.mapItem
      );

      return res.status(200).json(mapped);
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };
}
