import { Request, Response } from "express";
import { FundService } from "../services/fund.service";
import { Fund } from "../models";
import { MapperHelper, IList } from "../mappers/mapper.helper";
import { FundMapper, IFund } from "../mappers/fund.mapper";
import { Helper } from "../helpers/index";

export class FundController {
  public fundService: FundService = new FundService();
  public mapperHelper: MapperHelper = new MapperHelper();
  public fundMapper: FundMapper = new FundMapper();
  public helper: Helper = new Helper();

  public search = async (req: Request, res: Response) => {
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
