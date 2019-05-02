"use strict";
const { Fund, Account, Customer } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ledgers = [];
    const funds = await Fund.findAll();
    const accounts = await Account.findAll();
    const customers = await Customer.findAll();
    const min = Math.ceil(100);
    const max = Math.floor(1000);
    for (let i = 0; i < 10; i++) {
      funds.forEach(async (fund, index) => {
        const ledgerObject = {
          value: Math.floor(Math.random() * (max - min + 1)) + min,
          effective_date: new Date(),
          fund_id: fund.id,
          account_id: accounts[index].id,
          customer_id: customers[index].id,
          created_at: new Date(),
          updated_at: new Date()
        };

        ledgers.push(ledgerObject);
      });
    }
    return queryInterface.bulkInsert("ledgers", ledgers, {});
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
