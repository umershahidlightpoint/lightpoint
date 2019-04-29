import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance
  extends Sequelize.Instance<UserAttributes>,
    UserAttributes {}

export const UserFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<UserInstance, UserAttributes> => {
  const attributes: SequelizeAttributes<UserAttributes> = {
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    }
  };

  const User = sequelize.define<UserInstance, UserAttributes>(
    "User",
    attributes
  );

  User.associate = models => {
    User.hasMany(models.GeneralLedger);
  };

  return User;
};
