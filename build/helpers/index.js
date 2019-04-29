"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helper {
    success(code, message, data, meta) {
        return data instanceof Array
            ? {
                code: code || null,
                message: message || null,
                data: data || null,
                meta: meta || null
            }
            : {
                code: code || null,
                message: message || null,
                data: data || null
            };
    }
    error(code, message) {
        return {
            code: code || null,
            message: message || null
        };
    }
}
exports.Helper = Helper;
//# sourceMappingURL=index.js.map