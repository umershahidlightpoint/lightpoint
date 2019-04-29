import * as Sequelize from "sequelize";
import { DbInterface } from "../typings/DbInterface";
import { FundFactory } from "./fund";
import { AccountTypeFactory } from "./accountType";
import { AccountFactory } from "./account";
import { GeneralLedgerFactory } from "./generalLedger";
import { UserFactory } from "./user";

export const createModels = (sequelizeConfig: any): DbInterface => {
  const { database, username, password, params } = sequelizeConfig;
  const sequelize = new Sequelize(database, username, password, params);

  const db: DbInterface = {
    sequelize,
    Sequelize,
    Fund: FundFactory(sequelize, Sequelize),
    AccountType: AccountTypeFactory(sequelize, Sequelize),
    Account: AccountFactory(sequelize, Sequelize),
    GeneralLedger: GeneralLedgerFactory(sequelize, Sequelize),
    User: UserFactory(sequelize, Sequelize)
  };

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
