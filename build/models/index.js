"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const fund_1 = require("./fund");
const accountType_1 = require("./accountType");
const account_1 = require("./account");
const generalLedger_1 = require("./generalLedger");
const user_1 = require("./user");
exports.createModels = (sequelizeConfig) => {
    const { database, username, password, params } = sequelizeConfig;
    const sequelize = new Sequelize(database, username, password, params);
    const db = {
        sequelize,
        Sequelize,
        Fund: fund_1.FundFactory(sequelize, Sequelize),
        AccountType: accountType_1.AccountTypeFactory(sequelize, Sequelize),
        Account: account_1.AccountFactory(sequelize, Sequelize),
        GeneralLedger: generalLedger_1.GeneralLedgerFactory(sequelize, Sequelize),
        User: user_1.UserFactory(sequelize, Sequelize)
    };
    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    return db;
};
//# sourceMappingURL=index.js.map