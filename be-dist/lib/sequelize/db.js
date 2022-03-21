"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize({
    dialect: "postgres",
    username: "qeisujxsxqiemw",
    password: "68427b042c0f6f7f9b9f79012bfbb5433ae66263b31eb6f96e9b1bfb4314df48",
    database: "d2ifqhperktiau",
    port: 5432,
    host: "ec2-54-157-160-218.compute-1.amazonaws.com",
    ssl: true,
    // esto es necesario para que corra correctamente
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
