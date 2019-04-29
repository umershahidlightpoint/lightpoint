// import { Request, Response } from "express";
// import { UserService } from "../services/user";
// import { UserMapper } from "../mappers/user.mapper";
// import { Helper } from "../helpers/index";

// export class UserController {
//   public userService: UserService = new UserService();
//   public userMapper: UserMapper = new UserMapper();
//   public helper: Helper = new Helper();

//   public getUsers = async (req: Request, res: Response) => {
//     try {
//       interface Data {
//         data?: Array<object>;
//         meta?: object;
//       }

//       const result: Data = await this.userService.find();
//       const mappedFeed: Array<object> = this.userMapper.map(result.data);

//       return res.status(200).send({
//         result
//       });
//     } catch (error) {
//       const code = error.code ? error.code : 500;
//       const mappedError = this.helper.error(code, error.message);

//       return res.status(code).send(mappedError);
//     }
//   };

//   public seedUser = async (req: Request, res: Response) => {
//     try {
//       interface Data {
//         data?: Array<object>;
//         meta?: object;
//       }

//       const result: Data = await this.userService.create();
//       const mappedFeed: Array<object> = this.userMapper.map(result.data);

//       return res.status(200).send({
//         result
//       });
//     } catch (error) {
//       const code = error.code ? error.code : 500;
//       const mappedError = this.helper.error(code, error.message);

//       return res.status(code).send(mappedError);
//     }
//   };
// }
