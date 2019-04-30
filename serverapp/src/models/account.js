"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      accountTypeId: DataTypes.INTEGER,
      parentId: DataTypes.INTEGER
    },
    { tableName: "accounts" }
  );
  Account.associate = function(models) {
    // Associations Can be Defined Here
    Account.hasMany(models.Account, {
      as: "children",
      foreignKey: "parentId"
    });
    Account.belongsTo(models.Account, {
      as: "parent",
      foreignKey: "parentId"
    });
    Account.hasMany(models.Ledger, { foreignKey: "accountId" });
    Account.belongsTo(models.AccountType, { foreignKey: "accountTypeId" });
  };
  return Account;
};
