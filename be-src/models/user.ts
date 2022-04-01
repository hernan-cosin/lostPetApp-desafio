import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize/db";

export class User extends Model {}

User.init(
  {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
