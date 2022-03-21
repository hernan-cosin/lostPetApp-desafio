"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = void 0;
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv/config");
const models_1 = require("./models/models");
const models_2 = require("./models/models");
const models_3 = require("./models/models");
const user_controller_1 = require("./controllers/user-controller");
const pet_controler_1 = require("./controllers/pet-controler");
// import { sequelize } from "./lib/sequelize/db";
const PORT = process.env.PORT || 3009;
const SECRET = process.env.SECRET;
exports.SECRET = SECRET;
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
// Pet.sync({ force: true });
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
    // console.log(req._userInfo);
    if (req._userInfo.user == false) {
        return res.json({ Error: "unauthorized" });
    }
    if (req._userInfo.name && req._userInfo.lastName) {
        const userInfo = {
            name: req._userInfo.name,
            lastName: req._userInfo.lastName,
        };
        return res.json(userInfo);
    }
});
app.post("/pet", user_controller_1.middleware, async (req, res) => {
    try {
        console.log({
            petName: req.body.petName,
            petDescription: req.body.petDescription,
            status: req.body.status,
            geolog: { loc_lat: req.body.loc_lat, loc_lng: req.body.loc_lng },
            petZone: req.body.petZone,
        });
        const userId = req._userInfo.id;
        const response = await (0, pet_controler_1.createPet)(req.body, userId);
        res.json({ response });
    }
    catch (e) {
        throw new Error("Missing some data");
    }
});
app.get("/my-pets", user_controller_1.middleware, async (req, res) => {
    try {
        if (req._userInfo.user == false) {
            return res.json({ Error: "unauthorized" });
        }
        else {
            console.log("user info my pets", req._userInfo.id);
            const pets = await models_3.Pet.findAll({
                where: {
                    userId: req._userInfo.id,
                },
            });
            return res.send({ pets });
        }
    }
    catch (e) {
        console.log(e);
    }
});
app.use(express.static("fe-dist"));
app.get("*", (req, res) => {
    const ruta = path.resolve(__dirname, "../fe-dist/index.html");
    res.sendFile(ruta);
});
app.post("/allusers", (req, res) => {
    const allUsers = models_1.User.findAll();
    res.send(allUsers);
});
app.post("/allauth", async (req, res) => {
    const allAuth = await models_2.Auth.findAll();
    res.send(allAuth);
});
app.post("/allpets", async (req, res) => {
    const allPets = await models_3.Pet.findAll();
    res.send(allPets);
});
app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
});
