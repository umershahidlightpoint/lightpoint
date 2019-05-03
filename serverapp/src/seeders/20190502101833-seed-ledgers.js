"use strict";
const { Fund, Account, Customer, Ledger } = require("../models");
const faker = require("faker"); 

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    const funds = await Fund.findAll();
    const accounts = await Account.findAll();
    const customers = await Customer.findAll();

    customers.forEach(async(customer) => {
      const customerLedgers = [];
      funds.forEach(async (fund, index) => {
        accounts.forEach( async( account ) => {
          const ledgerObject = new Ledger(
            {
              value: faker.finance.amount(100, 1000, 2),
              effective_date: faker.date.recent(365),
              fund_id: fund.id,
              account_id: account.id,
              customer_id: customer.id,
            }
          );
          await ledgerObject.save();
        });
      });
      //queryInterface.bulkInsert("ledgers", customerLedgers, {});
    });
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
