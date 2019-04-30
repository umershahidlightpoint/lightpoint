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
      effective_date: {
        type: Sequelize.DATE
      },
      fund_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "funds",
          key: "id"
        }
      },
      account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "accounts",
          key: "id"
        }
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
          key: "id"
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ledgers");
  }
};
