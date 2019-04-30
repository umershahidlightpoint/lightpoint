"use strict";
module.exports = (sequelize, DataTypes) => {
  const Ledger = sequelize.define(
    "Ledger",
    {
      value: DataTypes.DOUBLE,
      effectiveDate: DataTypes.DATE,
      fundId: DataTypes.INTEGER,
      accountId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER
    },
    { tableName: "ledgers" }
  );
  Ledger.associate = function(models) {
    // Associations Can be Defined Here
    Ledger.belongsTo(models.Fund, { foreignKey: "fundId" });
    Ledger.belongsTo(models.Account, { foreignKey: "accountId" });
    Ledger.belongsTo(models.Customer, { foreignKey: "customerId" });
  };
  return Ledger;
};
