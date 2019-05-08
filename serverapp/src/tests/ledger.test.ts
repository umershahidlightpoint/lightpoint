import * as chai from "chai";
import chaiHttp = require("chai-http");
import app from "../app";
import { Fund, AccountType, Account, Ledger, Customer } from "../models";
import * as faker from "faker";
import { delay } from "bluebird";
import moment = require('moment');

chai.use(chaiHttp);
const should = chai.should();

describe("Ledgers", () => {
  before(async () => {
    await Ledger.destroy({
      where: {}
    });
    await Customer.destroy({
      where: {}
    });
    await Fund.destroy({
      where: {}
    });
    await Account.destroy({
      where: {}
    });
    await AccountType.destroy({
      where: {}
    });

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
    const funds = ["Q1-2018", "Q2-2018", "Q3-2018", "Q4-2018", "Q1-2019"];
    Promise.all(
      await accountTypes.map(async accountType => {
        let accountTypeRecord = await AccountType.findOne({
          where: { name: accountType.name }
        });
        if (accountTypeRecord === null) {
          accountTypeRecord = new AccountType({
            name: accountType.name
          });
          await accountTypeRecord.save();
        }
        await accountType.accounts.map(async account => {
          const accountRecord = await Account.findOne({
            where: { name: account, account_type_id: accountTypeRecord.id }
          });
          if (accountRecord === null) {
            const accountRecord = new Account({
              account_type_id: accountTypeRecord.id,
              name: account,
              description: faker.lorem.sentence()
            });
            await accountRecord.save();
          }
        });
      })
    );
    Promise.all(
      await funds.map(async fundName => {
        const existing = await Fund.findOne({ where: { name: fundName } });
        if (existing) {
          return existing;
        }
        const fundObject = {
          name: fundName,
          description: faker.lorem.sentence()
        };
        const fundRecord = new Fund(fundObject);
        return await fundRecord.save();
      })
    );
    for (let i = 0; i < 10; i++) {
      const customer = new Customer({
        email: faker.internet.email(),
        password: faker.internet.password(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName()
      });
      await customer.save();
    }

    delay(5000);
    console.log("RUNNING ENVIRONMENT :: ", process.env.NODE_ENV);
  });

  describe("GET /v1/ledgers", () => {
    it("Get all the Ledgers - Pass", () => {
      chai
        .request(app)
        .get("/v1/ledgers")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          if (res.body.length > 0) {
            res.body.data[0].should.have.property("id");
            res.body.data[0].should.have.property("value");
            res.body.data[0].should.have.property("effectiveDate");
            res.body.data[0].should.have.not.property("fund");
            res.body.data[0].should.have.property("account");
            res.body.data[0].should.have.property("customer");
            res.body.meta.should.have.property("total");
            res.body.meta.should.have.property("pages");
            res.body.meta.should.have.property("limit");
            res.body.meta.should.have.not.property("page");
            res.body.meta.should.have.property("next");
          }
        });
    });
  });

  describe("GET /v1/ledgers", () => {
    it("Get all the Ledgers - Fail", () => {
      chai
        .request(app)
        .get("/v1/ledgers?customer_id=0")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          if (res.body.length > 0) {
            res.body.data.length === 0;
            res.body.meta.should.have.property("total");
            res.body.meta.should.have.property("pages");
            res.body.meta.should.have.property("limit");
            res.body.meta.should.have.not.property("page");
            res.body.meta.should.have.property("next");
          }
        });
    });
  });

  describe("/POST /v1/ledgers", () => {
    it("Create a New Ledger", async () => {
      const fund = await Fund.findAll();
      const account = await Account.findAll();
      const customer = await Customer.findAll();
      const ledger = {
        value: 40,
        effectiveDate: moment(new Date()).format("YYYY-MM-DD"),
        fund_id: fund[0].id,
        account_id: account[0].id,
        customer_id: customer[0].id
      };
      chai
        .request(app)
        .post("/v1/ledgers")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send(ledger)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("value");
          res.body.should.have.property("effectiveDate");
          res.body.should.have.property("fund");
          res.body.should.have.property("account");
          res.body.should.have.property("customer");
        });
    });
  });

  // describe("GET /v1/ledgers/:ledger_id", () => {
  //   it("Get a Ledger By Id", async () => {
  //     const ledger = await Ledger.findAll();
  //     chai
  //       .request(app)
  //       .get("/v1/ledgers/" + ledger[0].id)
  //       .set("Content-Type", "application/json")
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.should.be.json;
  //         res.body.should.be.a("object");
  //         res.body.should.have.property("id");
  //         res.body.should.have.property("value");
  //         res.body.should.have.property("effectiveDate");
  //         res.body.should.have.property("fund");
  //         res.body.should.have.property("account");
  //         res.body.should.have.property("customer");
  //       });
  //   });
  // });
});
