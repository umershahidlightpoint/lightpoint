"use strict";
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING
    },
    { tableName: "customers" }
  );
  Customer.associate = function(models) {
    // Associations Can be Defined Here
    Customer.hasMany(models.Ledger, { foreignKey: "CustomerId" });
  };
  return Customer;
};
