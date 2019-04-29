"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = (sequelize, DataTypes) => {
    const attributes = {
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        }
    };
    const User = sequelize.define("User", attributes);
    User.associate = models => {
        User.hasMany(models.GeneralLedger);
    };
    return User;
};
//# sourceMappingURL=user.js.map