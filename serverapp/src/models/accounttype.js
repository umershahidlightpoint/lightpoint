"use strict";
module.exports = (sequelize, DataTypes) => {
  const AccountType = sequelize.define(
    "AccountType",
    {
      name: DataTypes.STRING
    },
    { tableName: "account_types" }
  );
  AccountType.associate = function(models) {
    // Associations Can be Defined Here
    AccountType.hasMany(models.Account, { foreignKey: "accountTypeId" });
  };
  return AccountType;
};
