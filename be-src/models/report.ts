import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize/db";

export class Report extends Model {}

Report.init(
  {
    reporterName: DataTypes.STRING,
    cellphone: DataTypes.INTEGER,
    lastSeen: DataTypes.TEXT,
  },
  { sequelize, modelName: "report" }
);
