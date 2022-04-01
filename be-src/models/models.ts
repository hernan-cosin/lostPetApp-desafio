import { User } from "./user";
import { Pet } from "./pet";
import { Auth } from "./auth";
import { Report } from "./report";

User.hasMany(Pet);
Pet.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Pet, Auth, Report };
