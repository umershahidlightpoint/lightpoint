"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralLedgerFactory = (sequelize, DataTypes) => {
    const attributes = {
        name: {
            type: DataTypes.STRING
        }
    };
    const GeneralLedger = sequelize.define("GeneralLedger", attributes);
    GeneralLedger.associate = models => {
        GeneralLedger.belongsTo(models.Fund);
        GeneralLedger.belongsTo(models.Account);
        GeneralLedger.belongsTo(models.User);
    };
    return GeneralLedger;
};
//# sourceMappingURL=generalLedger.js.map