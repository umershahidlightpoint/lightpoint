import { Request, Response, Router } from "express";
import { FundService } from "../../services/fund.service";
import { Fund } from "../../models";
import { MapperHelper, IList } from "../../mappers/mapper.helper";
import { FundMapper, IFund } from "../../mappers/fund.mapper";
import { Helper } from "../../helpers/index";

export class FundController {
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
      const mappedFeed = await this.mapperHelper.paginate(
        result,
        this.fundMapper.mapItem
      );

      return res
        .status(200)
        .send(
          this.helper.success(
            200,
            "Funds Found Successfully.",
            mappedFeed,
            result.meta
          )
        );
    } catch (error) {
      const code = error.code ? error.code : 500;
      const mappedError = this.helper.error(code, error.message);

      return res.status(code).send(mappedError);
    }
  };
}
