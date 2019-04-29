"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.resolve(
      queryInterface.addColumn("Users", "status", Sequelize.STRING)
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve(
      queryInterface.removeColumn("Users", "status", Sequelize.STRING)
    );
  }
};
