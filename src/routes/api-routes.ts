import { Application, Request, Response } from "express";
import { BASE_USER_ROUTE } from "./base-route";
// import { UserController } from "../controllers/user";
import { DbInterface } from "../typings/DbInterface";

export class Routes {
  // public userController: UserController = new UserController();

  public routes(app: Application, db: DbInterface): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "TypeScript App API"
      });
    });

    app.route(BASE_USER_ROUTE).get(async (req: Request, res: Response) => {
      const users: Array<Object> = await db.User.findAll();

      res.send({ users });
    });

    app
      .route(`${BASE_USER_ROUTE}/seed`)
      .get(async (req: Request, res: Response) => {
        const user: Object = await db.User.create({
          email: "john.doe@techverx.com",
          password: "techverx",
          name: "John Doe"
        });

        res.send({ user });
      });

    // app.route(BASE_USER_ROUTE).get(this.userController.getUsers);

    // app.route(`${BASE_USER_ROUTE}/seed`).get(this.userController.seedUser);
  }
}
