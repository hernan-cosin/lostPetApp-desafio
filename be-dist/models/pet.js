"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pet = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../lib/sequelize/db");
class Pet extends sequelize_1.Model {
}
exports.Pet = Pet;
Pet.init({
    name: sequelize_1.DataTypes.STRING,
    description: sequelize_1.DataTypes.TEXT,
    imgUrl: sequelize_1.DataTypes.STRING,
    status: sequelize_1.DataTypes.STRING,
    loc_lat: sequelize_1.DataTypes.FLOAT,
    loc_lng: sequelize_1.DataTypes.FLOAT,
    petZone: sequelize_1.DataTypes.STRING,
}, { sequelize: db_1.sequelize, modelName: "pet" });
