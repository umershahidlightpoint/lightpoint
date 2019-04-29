import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";

export interface AccountTypeAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountTypeInstance
  extends Sequelize.Instance<AccountTypeAttributes>,
    AccountTypeAttributes {}

export const AccountTypeFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<AccountTypeInstance, AccountTypeAttributes> => {
  const attributes: SequelizeAttributes<AccountTypeAttributes> = {
    name: {
      type: DataTypes.STRING
    }
  };

  const AccountType = sequelize.define<
    AccountTypeInstance,
    AccountTypeAttributes
  >("AccountType", attributes);

  AccountType.associate = models => {
    AccountType.hasMany(models.Account);
  };

  return AccountType;
};
