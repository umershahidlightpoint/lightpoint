"use strict";
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING
    },
    { tableName: "customers", createdAt: "created_at", updatedAt: "updated_at" }
  );
  Customer.associate = function(models) {
    // Associations Can be Defined Here
    Customer.hasMany(models.Ledger, { foreignKey: "customer_id" });
  };
  return Customer;
};
