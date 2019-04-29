import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";

export interface AccountAttributes {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountInstance
  extends Sequelize.Instance<AccountAttributes>,
    AccountAttributes {}

export const AccountFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<AccountInstance, AccountAttributes> => {
  const attributes: SequelizeAttributes<AccountAttributes> = {
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
  };

  const Account = sequelize.define<AccountInstance, AccountAttributes>(
    "Account",
    attributes
  );

  Account.associate = models => {
    Account.hasMany(models.GeneralLedger);
    Account.belongsTo(models.AccountType);
  };

  return Account;
};
