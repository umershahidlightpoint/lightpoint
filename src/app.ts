import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/api-routes";
import * as Sequelize from "sequelize";
import { DbInterface } from "./typings/DbInterface";
import { createModels } from "./models";
import * as config from "./config/config.json";

class App {
  public app: express.Application;
  public appRoute: Routes = new Routes();
  public db: DbInterface = createModels(config);
  public Op = Sequelize.Op;

  constructor() {
    this.app = express();
    this.config();
    this.appRoute.routes(this.app, this.db);
    // this.db.sequelize.sync();
  }

  private config = (): void => {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  };
}

export default new App().app;
