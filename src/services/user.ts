// import * as Sequelize from "sequelize";
// import { createModels } from "../models";
// import { UserInstance } from "../models/user";

// export class UserService {
//   public Op = Sequelize.Op;
//   public sequelizeConfig = require("../config/sequelizeConfig.json");
//   public db = createModels(this.sequelizeConfig);

//   constructor() {
//     this.db.sequelize.sync();
//   }

//   public find = async (): Promise<object> => {
//     try {
//       this.db.User.findAll()
//         .then((users: UserInstance[]) => {
//           return Promise.resolve(users);
//         })
//         .catch(err => {
//           return Promise.reject(err);
//         });
//     } catch (error) {
//       if (error) return Promise.reject(error);
//     }
//   };

//   public create = async (): Promise<object> => {
//     try {
//       this.db.User.create({
//         first_name: "Usman",
//         last_name: "Anwar",
//         email: "usman@techverx.com",
//         password: "techverx"
//       })
//         .then(user => {
//           return Promise.resolve(user);
//         })
//         .catch(err => {
//           return Promise.reject(err);
//         });
//     } catch (error) {
//       if (error) return Promise.reject(error);
//     }
//   };
// }
