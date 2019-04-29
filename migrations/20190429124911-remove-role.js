'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.resolve(
      queryInterface.removeColumn("Users", "role", Sequelize.STRING)
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve(
      queryInterface.addColumn("Users", "role", Sequelize.STRING)
    );
  }
};
