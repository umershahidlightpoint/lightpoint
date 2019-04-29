import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../typings/SequelizeAttributes";

export interface GeneralLedgerAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GeneralLedgerInstance
  extends Sequelize.Instance<GeneralLedgerAttributes>,
    GeneralLedgerAttributes {}

export const GeneralLedgerFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): Sequelize.Model<GeneralLedgerInstance, GeneralLedgerAttributes> => {
  const attributes: SequelizeAttributes<GeneralLedgerAttributes> = {
    name: {
      type: DataTypes.STRING
    }
  };

  const GeneralLedger = sequelize.define<
    GeneralLedgerInstance,
    GeneralLedgerAttributes
  >("GeneralLedger", attributes);

  GeneralLedger.associate = models => {
    GeneralLedger.belongsTo(models.Fund);
    GeneralLedger.belongsTo(models.Account);
    GeneralLedger.belongsTo(models.User);
  };

  return GeneralLedger;
};
