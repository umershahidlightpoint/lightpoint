"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ledgers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.DOUBLE
      },
      effectiveDate: {
        type: Sequelize.DATE
      },
      fundId: {
        type: Sequelize.INTEGER,
        references: {
          model: "funds",
          key: "id"
        }
      },
      accountId: {
        type: Sequelize.INTEGER,
        references: {
          model: "accounts",
          key: "id"
        }
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ledgers");
  }
};
