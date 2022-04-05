"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = void 0;
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv/config");
const models_1 = require("./models/models");
const user_controller_1 = require("./controllers/user-controller");
const pet_controler_1 = require("./controllers/pet-controler");
const report_controller_1 = require("./controllers/report-controller");
// // SEQUELIZE SYNC
// import { sequelize } from "./lib/sequelize/db";
// try {
//   sequelize.sync({ force: true }).then((res) => {
//     console.log(res);
//   });
// } catch (e) {
//   console.log(e);
// }
const PORT = process.env.PORT || 3009;
const SECRET = process.env.SECRET;
exports.SECRET = SECRET;
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.get("/test", async (req, res) => {
    res.json({ test: true });
});
app.post("/email-check", async (req, res) => {
    const response = await (0, user_controller_1.emailCheck)(req.body.email);
    res.json({ userFound: response });
});
app.post("/auth", async (req, res) => {
    const response = await (0, user_controller_1.creteUser)(req.body);
    res.json({ response });
});
app.put("/pass", async (req, res) => {
    const passRestoreRes = await (0, user_controller_1.passRestore)(req.body);
    return res.json({ passRestoreRes });
});
app.post("/auth/token", async (req, res) => {
    const result = await (0, user_controller_1.AuthToken)(req.body);
    if (result.verified == true) {
        res.json({ verified: result.verified, token: result.token });
    }
    else {
        res.json({ verified: false });
    }
});
app.put("/user", user_controller_1.middleware, async (req, res) => {
    const result = await (0, user_controller_1.updateUser)(req.body);
    res.json(result);
});
app.get("/me", user_controller_1.middleware, async (req, res) => {
    const userInformationResponse = await (0, user_controller_1.UserInformation)(req);
    if (userInformationResponse["Error"] == "unauthorized") {
        return res.json({ Error: "unauthorized" });
    }
    else {
        return res.json(userInformationResponse);
    }
});
app.post("/pet", user_controller_1.middleware, async (req, res) => {
    try {
        const userId = req._userInfo.id;
        const response = await (0, pet_controler_1.createPet)(req.body, userId);
        res.json({ response });
    }
    catch (e) {
        throw new Error("Missing some data");
    }
});
app.put("/pet", user_controller_1.middleware, async (req, res) => {
    const result = await (0, pet_controler_1.updatePet)(req.body);
    res.json(result);
});
app.get("/my-pets", user_controller_1.middleware, async (req, res) => {
    const myPets = await (0, pet_controler_1.getMyPets)(req);
    if (myPets.Error == "unauthorized") {
        return res.json({ Error: "unauthorized" });
    }
    else {
        return res.json(myPets);
    }
});
app.get("/pets-near-location", async (req, res) => {
    const petsNearLocationResponse = await (0, pet_controler_1.petsNearLocation)(req);
    return res.json({ petsNearLocationResponse });
});
app.put("/pet/found", async (req, res) => {
    const setFoundPetResponse = await (0, pet_controler_1.setFoundPet)(req.body);
    if (setFoundPetResponse == true) {
        return res.json({ setFoundPet: true });
    }
    if (setFoundPetResponse == false) {
        return res.json({ setFoundPet: false });
    }
});
app.put("/pet/unpublish", async (req, res) => {
    const unpublisPetResponse = await (0, pet_controler_1.unpublishPet)(req.body);
    if (unpublisPetResponse == true) {
        return res.json({ unpublished: true });
    }
    if (unpublisPetResponse == false) {
        return res.json({ unpublished: false });
    }
});
app.put("/pet/publish-again", async (req, res) => {
    const publishAgainPetResponse = await (0, pet_controler_1.publishAgainPet)(req.body);
    if (publishAgainPetResponse == true) {
        return res.json({ publishAgain: true });
    }
    if (publishAgainPetResponse == false) {
        return res.json({ publishAgain: false });
    }
});
app.post("/create-report", async (req, res) => {
    const { reporterName } = req.body;
    const { cellphone } = req.body;
    const { lastSeen } = req.body;
    const { petId } = req.body;
    const reportInfo = {
        reporterName,
        cellphone,
        lastSeen,
    };
    const createReportResponse = await (0, report_controller_1.reportPet)(reportInfo, petId);
    if (createReportResponse) {
        return res.json({ reportCreated: true });
    }
    if (!createReportResponse) {
        return res.json({ reportCreated: false });
    }
});
app.post("/send-email", async (req, res) => {
    const sendEmailController = await (0, report_controller_1.sendEmail)(req.body);
    return res.json({ sendEmailController });
});
app.use(express.static("fe-dist"));
app.get("*", (req, res) => {
    const ruta = path.resolve(__dirname, "../fe-dist/index.html");
    res.sendFile(ruta);
});
app.post("/allusers", async (req, res) => {
    try {
        const allUsers = await models_1.User.findAll();
        res.send(allUsers);
    }
    catch (e) {
        console.log(e);
    }
});
app.post("/allauth", async (req, res) => {
    try {
        const allAuth = await models_1.Auth.findAll();
        res.send(allAuth);
    }
    catch (e) {
        console.log(e);
    }
});
app.post("/allpets", async (req, res) => {
    try {
        const allPets = await models_1.Pet.findAll({
            include: {
                model: models_1.Report,
            },
        });
        res.send(allPets);
    }
    catch (e) {
        console.log(e);
    }
});
app.post("/allreports", async (req, res) => {
    try {
        const allReports = await models_1.Report.findAll({ include: models_1.Pet });
        res.send(allReports);
    }
    catch (e) {
        console.log(e);
    }
});
app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
});
