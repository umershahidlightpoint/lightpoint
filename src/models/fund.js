"use strict";
module.exports = (sequelize, DataTypes) => {
  const Fund = sequelize.define(
    "Fund",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    { tableName: "funds" }
  );
  Fund.associate = function(models) {
    // Associations Can be Defined Here
    Fund.hasMany(models.Ledger, { foreignKey: "fundId" });
  };
  return Fund;
};
