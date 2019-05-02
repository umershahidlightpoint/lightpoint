"use strict";
module.exports = (sequelize, DataTypes) => {
  const AccountType = sequelize.define(
    "AccountType",
    {
      name: DataTypes.STRING
    },
    { tableName: "account_types", createdAt: "created_at", updatedAt: "updated_at" }
  );
  AccountType.associate = function(models) {
    // Associations Can be Defined Here
    AccountType.hasMany(models.Account, { foreignKey: "account_type_id" });
  };
  return AccountType;
};
