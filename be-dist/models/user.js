"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../lib/sequelize/db");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    email: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.STRING,
    lastName: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
}, { sequelize: db_1.sequelize, modelName: "user" });
