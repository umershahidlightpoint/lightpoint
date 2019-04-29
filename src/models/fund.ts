import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";

export interface FundAttributes {
  id?: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FundInstance
  extends Sequelize.Instance<FundAttributes>,
    FundAttributes {}

export const FundFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<FundInstance, FundAttributes> => {
  const attributes: SequelizeAttributes<FundAttributes> = {
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
  };

  const Fund = sequelize.define<FundInstance, FundAttributes>(
    "Fund",
    attributes
  );

  Fund.associate = models => {
    Fund.hasMany(models.GeneralLedger);
  };

  return Fund;
};
