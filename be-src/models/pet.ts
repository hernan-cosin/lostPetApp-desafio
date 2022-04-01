import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/sequelize/db";

export class Pet extends Model {}

Pet.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    imgUrl: DataTypes.TEXT,
    status: DataTypes.STRING,
    loc_lat: DataTypes.FLOAT,
    loc_lng: DataTypes.FLOAT,
    petZone: DataTypes.STRING,
    deleted: DataTypes.STRING,
  },
  { sequelize, modelName: "pet" }
);
