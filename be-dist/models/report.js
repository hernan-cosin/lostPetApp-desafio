"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../lib/sequelize/db");
class Report extends sequelize_1.Model {
}
exports.Report = Report;
Report.init({
    reporter_name: sequelize_1.DataTypes.STRING,
    cellphone: sequelize_1.DataTypes.NUMBER,
    last_seen: sequelize_1.DataTypes.TEXT,
}, { sequelize: db_1.sequelize, modelName: "report" });
