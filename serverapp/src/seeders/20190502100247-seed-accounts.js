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
            name: "LB-Q1-2018",
            children: ["LB-Jan-2018", "LB-Feb-2018", "LB-March-2018"]
          },
          {
            name: "LB-Q2-2018",
            children: ["LB-Apr-2018", "LB-May-2018", "LB-June-2018"]
          },
          {
            name: "LB-Q3-2018",
            children: ["LB-July-2018", "LB-Aug-2018", "LB-Sept-2018"]
          },
          {
            name: "LB-Q4-2018",
            children: ["LB-Oct-2018", "LB-Nov-2018", "LB-Dec-2018"]
          },
          {
            name: "LB-Q1-2019",
            children: ["LB-Jan-2019", "LB-Feb-2019", "LB-March-2019"]
          }
        ]
      },
      {
        name: "Expenses",
        notes: "",
        accounts: [
          {
            name: "EXP-Q1-2018",
            children: ["EXP-Jan-2018", "EXP-Feb-2018", "EXP-March-2018"]
          },
          {
            name: "EXP-Q2-2018",
            children: ["EXP-Apr-2018", "EXP-May-2018", "EXP-June-2018"]
          },
          {
            name: "EXP-Q3-2018",
            children: ["EXP-July-2018", "EXP-Aug-2018", "EXP-Sept-2018"]
          },
          {
            name: "EXP-Q4-2018",
            children: ["EXP-Oct-2018", "EXP-Nov-2018", "EXP-Dec-2018"]
          },
          {
            name: "EXP-Q1-2019",
            children: ["EXP-Jan-2019", "EXP-Feb-2019", "EXP-March-2019"]
          }
        ]
      },
      {
        name: "Equity",
        notes: "",
        accounts: [
          {
            name: "EQ-Q1-2018",
            children: ["EQ-Jan-2018", "EQ-Feb-2018", "EQ-March-2018"]
          },
          {
            name: "EQ-Q2-2018",
            children: ["EQ-Apr-2018", "EQ-May-2018", "EQ-June-2018"]
          },
          {
            name: "EQ-Q3-2018",
            children: ["EQ-July-2018", "EQ-Aug-2018", "EQ-Sept-2018"]
          },
          {
            name: "EQ-Q4-2018",
            children: ["EQ-Oct-2018", "EQ-Nov-2018", "EQ-Dec-2018"]
          },
          {
            name: "EQ-Q1-2019",
            children: ["EQ-Jan-2019", "EQ-Feb-2019", "EQ-March-2019"]
          }
        ]
      },
      {
        name: "Asset",
        notes: "",
        accounts: [
          {
            name: "AT-Q1-2018",
            children: ["AT-Jan-2018", "AT-Feb-2018", "AT-March-2018"]
          },
          {
            name: "AT-Q2-2018",
            children: ["AT-Apr-2018", "AT-May-2018", "AT-June-2018"]
          },
          {
            name: "AT-Q3-2018",
            children: ["AT-July-2018", "AT-Aug-2018", "AT-Sept-2018"]
          },
          {
            name: "AT-Q4-2018",
            children: ["AT-Oct-2018", "AT-Nov-2018", "AT-Dec-2018"]
          },
          {
            name: "AT-Q1-2019",
            children: ["AT-Jan-2019", "AT-Feb-2019", "AT-March-2019"]
          }
        ]
      },
      {
        name: "Revenue",
        notes: "",
        accounts: [
          {
            name: "REV-Q1-2018",
            children: ["REV-Jan-2018", "REV-Feb-2018", "REV-March-2018"]
          },
          {
            name: "REV-Q2-2018",
            children: ["REV-Apr-2018", "REV-May-2018", "REV-June-2018"]
          },
          {
            name: "REV-Q3-2018",
            children: ["REV-July-2018", "REV-Aug-2018", "REV-Sept-2018"]
          },
          {
            name: "REV-Q4-2018",
            children: ["REV-Oct-2018", "REV-Nov-2018", "REV-Dec-2018"]
          },
          {
            name: "REV-Q1-2019",
            children: ["REV-Jan-2019", "REV-Feb-2019", "REV-March-2019"]
          }
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
        account.children.forEach(async (child, index) => {
          const childAccountRow = await Account.create({
            name: child,
            description: "",
            account_type_id: accountTypeRow.id,
            parent_id: accountRow.id
          });
        });
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
