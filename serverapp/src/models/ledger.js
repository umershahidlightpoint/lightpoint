"use strict";
module.exports = (sequelize, DataTypes) => {
  const Ledger = sequelize.define(
    "Ledger",
    {
      value: DataTypes.DOUBLE,
      effective_date: DataTypes.DATE,
      fund_id: DataTypes.INTEGER,
      account_id: DataTypes.INTEGER,
      customer_id: DataTypes.INTEGER
    },
    { tableName: "ledgers", createdAt: "created_at", updatedAt: "updated_at" }
  );
  Ledger.associate = function(models) {
    // Associations Can be Defined Here
    Ledger.belongsTo(models.Fund, { foreignKey: "fund_id" });
    Ledger.belongsTo(models.Account, { foreignKey: "account_id" });
    Ledger.belongsTo(models.Customer, { foreignKey: "customer_id" });
  };
  return Ledger;
};
