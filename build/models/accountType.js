"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTypeFactory = (sequelize, DataTypes) => {
    const attributes = {
        name: {
            type: DataTypes.STRING
        }
    };
    const AccountType = sequelize.define("AccountType", attributes);
    AccountType.associate = models => {
        AccountType.hasMany(models.Account);
    };
    return AccountType;
};
//# sourceMappingURL=accountType.js.map