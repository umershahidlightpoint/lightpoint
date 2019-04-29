"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountFactory = (sequelize, DataTypes) => {
    const attributes = {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    };
    const Account = sequelize.define("Account", attributes);
    Account.associate = models => {
        Account.hasMany(models.GeneralLedger);
        Account.belongsTo(models.AccountType);
    };
    return Account;
};
//# sourceMappingURL=account.js.map