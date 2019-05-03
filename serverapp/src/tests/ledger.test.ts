import * as chai from "chai";
import chaiHttp = require("chai-http");
import app from "../app";
import { Fund, Account, Ledger, Customer } from "../models";

chai.use(chaiHttp);
const should = chai.should();

describe("Ledgers", () => {
  describe("GET /v1/ledgers", () => {
    it("Get all the Ledgers", done => {
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
          }
          done();
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
        effectiveDate: new Date(),
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

  describe("GET /v1/ledgers/:ledger_id", () => {
    it("Get a Ledger By Id", async () => {
      const ledger = await Ledger.findAll();
      chai
        .request(app)
        .get("/v1/ledgers/" + ledger[0].id)
        .set("Content-Type", "application/json")
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
});
