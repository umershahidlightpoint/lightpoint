"use strict";
const {
  Fund,
  Account,
  Customer,
  Ledger,
  AccountType
} = require("./src/models");
const faker = require("faker");

faker.seed(1000);

const accountTypes = [
  {
    name: "Liabilities",
    notes: "",
    accounts: [
      "LB-Account1",
      "LB-Account2",
      "LB-Account3",
      "LB-Account4",
      "LB-Account5"
    ]
  },
  {
    name: "Expenses",
    notes: "",
    accounts: [
      "EX-Account1",
      "EX-Account2",
      "EX-Account3",
      "EX-Account4",
      "EX-Account5"
    ]
  },
  {
    name: "Equity",
    notes: "",
    accounts: [
      "EQ-Account1",
      "EQ-Account2",
      "EQ-Account3",
      "EQ-Account4",
      "EQ-Account5"
    ]
  },
  {
    name: "Asset",
    notes: "",
    accounts: [
      "AT-Account1",
      "AT-Account2",
      "AT-Account3",
      "AT-Account4",
      "AT-Account5"
    ]
  },
  {
    name: "Revenue",
    accounts: [
      "REV-Account1",
      "REV-Account2",
      "REV-Account3",
      "REV-Account4",
      "REV-Account5"
    ]
  }
];
const createAccountTypes = async accountTypes => {
  return await accountTypes.map(async accountType => {
    let accountTypeRecord = await AccountType.findOne({
      where: { name: accountType.name }
    });
    if (accountTypeRecord == null) {
      accountTypeRecord = new AccountType({
        name: accountType.name
      });
      await accountTypeRecord.save();
    }
    const accounts = await accountType.accounts.map(async account => {
      let accountRecord = await Account.findOne({
        where: { name: account, account_type_id: accountTypeRecord.id }
      });
      if (accountRecord === null) {
        const accountRecord = new Account({
          account_type_id: accountTypeRecord.id,
          name: account
        });
        await accountRecord.save();
      }
      return accountRecord;
    });
    return accountTypeRecord;
  });
};

const createLedger = async (customer, accounts, funds) => {
  return new Promise(async (resolve, reject) => {
    let fundsPromises = await funds.map(async fund => {
      let accountsPromises = await accounts.map(async account => {
        const ledgerObject = new Ledger({
          value: faker.finance.amount(100, 1000, 2),
          effective_date: faker.date.recent(365),
          fund_id: fund.id,
          account_id: account.id,
          customer_id: customer.id
        });
        return await ledgerObject.save();
      });
      return Promise.all(accountsPromises).then(p => {
        return p;
      });
    });
    return Promise.all(fundsPromises).then(() => {
      resolve();
    });
  });
};

const importCustomers = async count => {
  return new Promise(async resolve => {
    const customers = [];
    for (let i = 0; i < count; i++) {
      const email = faker.internet.email();
      let customer = await Customer.findOne({ where: { email: email } });
      if (customer === null) {
        const customerObject = {
          email: email,
          password: faker.internet.password(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName()
        };
        customer = new Customer(customerObject);
        await customer.save();
      }
      customers.push(customer);
    }
    resolve(customers);
  });
};

const importFunds = async funds => {
  const savedFunds = await funds.map(async fundName => {
    let existing = await Fund.findOne({ where: { name: fundName } });
    if (existing) {
      return existing;
    }
    const fundObject = {
      name: fundName
    };
    const fundRecord = new Fund(fundObject);
    return await fundRecord.save();
  });
  return new Promise((resolve, reject) => {
    return Promise.all(savedFunds).then(p => {
      resolve(p);
    });
  });
};

(async () => {
  const fundNames = ["ASIA_FCS", "LP", "MBFund"];
  const savedFunds = await importFunds(fundNames);
  const customers = await importCustomers(2);
  const accounts = await createAccountTypes(accountTypes);
  Promise.all(accounts).then(async t => {
    const funds = await Fund.findAll();
    const customers = await Customer.findAll();
    const accounts = await Account.findAll();
    const ledgers = customers.map(async customer => {
      return await createLedger(customer, accounts, funds);
    });
    Promise.all(ledgers).then(() => {
      process.exit(0);
    });
  });
  //const data = await importData();
  //process.exit(0);
})();
