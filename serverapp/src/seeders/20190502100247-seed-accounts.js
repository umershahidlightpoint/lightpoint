"use strict";
const { AccountType, Account } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const accountTypes = [
      {
        name: "Liabilities",
        notes: "",
        accounts: [
          {
            name: "LB-Account1",
          },
          {
            name: "LB-Account2",
            children: ["LB-Apr-2018", "LB-May-2018", "LB-June-2018"]
          },
          {
            name: "LB-Account3",
            children: ["LB-July-2018", "LB-Aug-2018", "LB-Sept-2018"]
          }
        ]
      },
      {
        name: "Expenses",
        notes: "",
        accounts: [
          {
            name: "EXP-Account1",
            children: []
          },
          {
            name: "EXP-Account2",
            children: []
          },
          {
            name: "EXP-Account3",
            children: []
          },
          {
            name: "EXP-Account4",
            children: []
          },
          {
            name: "EXP-Account5",
            children: []
          },
        ]
      },
      {
        name: "Equity",
        notes: "",
        accounts: [
          {
            name: "EQ-Account1",
          },
          {
            name: "EQ-Account2",
          },
          {
            name: "EQ-Account3",
          },
          {
            name: "EQ-Account4",
          },
          {
            name: "EQ-Account5",
          },
        ]
      },
      {
        name: "Asset",
        notes: "",
        accounts: [
          {
            name: "AT-Account1",
          },
          {
            name: "AT-Account2",
          },
          {
            name: "AT-Account3",
          },
          {
            name: "AT-Account4",
          },
          {
            name: "AT-Account5",
          },
        ]
      },
      {
        name: "Revenue",
        notes: "",
        accounts: [
          {
            name: "REV-Account1",
          },
          {
            name: "REV-Account2",
          },
          {
            name: "REV-Account3",
          },
          {
            name: "REV-Account4",
          },
          {
            name: "REV-Account5",
          },
        ]
      }
    ];
    accountTypes.forEach(async accountType => {
      const accountTypeRow = await AccountType.create({
        name: accountType.name
      });
      accountType.accounts.forEach(async account => {
        const accountRow = await Account.create({
          name: account.name,
          description: "",
          account_type_id: accountTypeRow.id
        });
        // account.children.forEach(async (child, index) => {
        //   const childAccountRow = await Account.create({
        //     name: child,
        //     description: "",
        //     account_type_id: accountTypeRow.id,
        //     parent_id: accountRow.id
        //   });
        // });
      });
    });

    return queryInterface.sequelize.query("SELECT * FROM accounts");
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
