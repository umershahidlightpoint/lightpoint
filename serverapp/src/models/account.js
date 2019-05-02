"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      account_type_id: DataTypes.INTEGER,
      parent_id: DataTypes.INTEGER
    },
    { tableName: "accounts", createdAt: "created_at", updatedAt: "updated_at" }
  );
  Account.associate = function(models) {
    // Associations Can be Defined Here
    Account.hasMany(models.Account, {
      as: "children",
      foreignKey: "parent_id"
    });
    Account.belongsTo(models.Account, {
      as: "parent",
      foreignKey: "parent_id"
    });
    Account.hasMany(models.Ledger, { foreignKey: "account_id" });
    Account.belongsTo(models.AccountType, {
      foreignKey: "account_type_id",
      as: "accountType"
    });
  };
  return Account;
};
