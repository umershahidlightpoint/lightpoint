import * as Sequelize from "sequelize";
import { FundInstance, FundAttributes } from "../../models/fund";
import {
  AccountTypeInstance,
  AccountTypeAttributes
} from "../../models/accountType";
import { AccountInstance, AccountAttributes } from "../../models/account";
import {
  GeneralLedgerInstance,
  GeneralLedgerAttributes
} from "../../models/generalLedger";
import { UserInstance, UserAttributes } from "../../models/user";

export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  Fund: Sequelize.Model<FundInstance, FundAttributes>;
  AccountType: Sequelize.Model<AccountTypeInstance, AccountTypeAttributes>;
  Account: Sequelize.Model<AccountInstance, AccountAttributes>;
  GeneralLedger: Sequelize.Model<
    GeneralLedgerInstance,
    GeneralLedgerAttributes
  >;
  User: Sequelize.Model<UserInstance, UserAttributes>;
}
