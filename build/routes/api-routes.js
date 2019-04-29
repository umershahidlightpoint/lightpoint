"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_route_1 = require("./base-route");
class Routes {
    routes(app, db) {
        app.route("/").get((req, res) => {
            res.status(200).send({
                message: "TypeScript App API"
            });
        });
        app.route(base_route_1.BASE_USER_ROUTE).get((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const users = yield db.User.findAll();
            res.send({ users });
        }));
        app
            .route(`${base_route_1.BASE_USER_ROUTE}/seed`)
            .get((req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield db.User.create({
                email: "john.doe@techverx.com",
                password: "techverx",
                name: "John Doe"
            });
            res.send({ user });
        }));
    }
}
exports.Routes = Routes;
//# sourceMappingURL=api-routes.js.map