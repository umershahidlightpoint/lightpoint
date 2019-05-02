import { Request, Response, Router } from "express";
import { Account } from "../../models";
import { MapperHelper, IList } from "../../mappers/mapper.helper";
import { Helper } from "../../helpers/index";
import { IController } from "./icontroller";

export class AccountController implements IController {
  public mapperHelper: MapperHelper = new MapperHelper();
  public helper: Helper = new Helper();

  public getRouter(): Router {
    const router = Router();
    router.get("", this.search);
    router.post("", this.create);
    router.get("/:account_id", this.findById);
    return router;
  }

  public create = async (req: Request, res: Response) => {};

  public search = async (req: Request, res: Response) => {};

  public findById = async (req: Request, res: Response) => {};
}
