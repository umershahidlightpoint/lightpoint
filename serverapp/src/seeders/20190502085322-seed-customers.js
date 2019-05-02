"use strict";
const {Customer} = require("../models");
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const customers = [];
    for (let i = 0; i < 20; i++) {
      const customerObject = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        created_at: new Date(),
        updated_at: new Date()
      };

      customers.push(customerObject);
    }

    return queryInterface.bulkInsert("customers", customers, {});
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
