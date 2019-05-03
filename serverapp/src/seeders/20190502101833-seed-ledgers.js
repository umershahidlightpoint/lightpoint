"use strict";
const { Fund, Account, Customer, Ledger } = require("../models");
const faker = require("faker"); 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("SELECT * FROM ledgers");
  },
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
