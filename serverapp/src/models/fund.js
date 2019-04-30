"use strict";
module.exports = (sequelize, DataTypes) => {
  const Fund = sequelize.define(
    "Fund",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    { tableName: "funds", createdAt: "created_at", updatedAt: "updated_at" }
  );
  Fund.associate = function(models) {
    // Associations Can be Defined Here
    Fund.hasMany(models.Ledger, { foreignKey: "fund_id" });
  };
  return Fund;
};
