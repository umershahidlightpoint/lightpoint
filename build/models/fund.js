"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundFactory = (sequelize, DataTypes) => {
    const attributes = {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    };
    const Fund = sequelize.define("Fund", attributes);
    Fund.associate = models => {
        Fund.hasMany(models.GeneralLedger);
    };
    return Fund;
};
//# sourceMappingURL=fund.js.map