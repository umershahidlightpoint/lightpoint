"use strict";
const { Fund, Account, Customer, Ledger } = require("./src/models");
const faker = require("faker");


const createLedger = async(customer, fund, account) => {
  return new Promise(async(resolve, reject) => {
    const ledgerObject = new Ledger(
      {
        value: faker.finance.amount(100, 1000, 2),
        effective_date: faker.date.recent(365),
        fund_id: fund.id,
        account_id: account.id,
        customer_id: customer.id,
      }
    );
    let savedEntity = await ledgerObject.save();
    resolve(savedEntity);
  });
}

const importData = async() => {
  const funds = await Fund.findAll();
  const accounts = await Account.findAll();
  const customers = await Customer.findAll();

  const customerPromises = customers.map(async(customer) => {
    return new Promise(async(resolve, reject) => {
      const customerLedgers = [];
      const fundAccounts = funds.map(async (fund, index) => {
        const accountPromises = accounts.map( async( account ) => {
          return await createLedger(customer, fund, account);
        });
        return accountPromises;
      });
      return fundAccounts;
    });
  });
  return Promise.all(customerPromises).then( (customers) => {
    return customers;
  });
}

(async () => {
  const data = await importData();
  data.then( d => {
    process.exit(0);
  });
})();