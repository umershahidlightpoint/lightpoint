"use strict";
const { Fund } = require("../models");
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const fundsData = ['ASIA_FCS', 'LP', 'MBFund'];
    const funds = [];
    fundsData.forEach(fundData => {
      const fundObject = {
        name: fundData,
        description: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date()
      };

      funds.push(fundObject);
    });

    return queryInterface.bulkInsert("funds", funds, {});
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
