"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const api_routes_1 = require("./routes/api-routes");
const Sequelize = require("sequelize");
const models_1 = require("./models");
const config = require("./config/config.json");
class App {
    constructor() {
        this.appRoute = new api_routes_1.Routes();
        this.db = models_1.createModels(config);
        this.Op = Sequelize.Op;
        this.config = () => {
            this.app.use(cors());
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));
        };
        this.app = express();
        this.config();
        this.appRoute.routes(this.app, this.db);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map