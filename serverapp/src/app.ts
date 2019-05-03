import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/api-routes";

class App {
  public app: express.Application;
  public appRoute: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
  }

  private config = (): void => {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/v1", this.appRoute.getRoutes());
  };
}

export default new App().app;
