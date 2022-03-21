"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.updateUser = exports.AuthToken = exports.creteUser = exports.emailCheck = void 0;
const models_1 = require("../models/models");
const models_2 = require("../models/models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const index_1 = require("../index");
function getSHA256ofString(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}
async function emailCheck(email) {
    const user = await models_1.User.findAll({
        where: {
            email: email,
        },
    });
    if (user.length == 0) {
        return false;
    }
    else {
        return true;
    }
}
exports.emailCheck = emailCheck;
async function creteUser(userData) {
    try {
        const password = getSHA256ofString(userData.password.toString());
        const password1 = getSHA256ofString(userData.password1.toString());
        if (password !== password1) {
            throw new Error("Las contraseñas deben coincidir");
        }
        const [user, created] = await models_1.User.findOrCreate({
            where: { email: userData.email },
            defaults: {
                email: userData.email,
                name: userData.name,
                lastName: userData.lastName,
            },
        });
        const getUserId = user.get("id");
        const [auth, authCreated] = await models_2.Auth.findOrCreate({
            where: { userId: getUserId },
            defaults: {
                email: userData.email,
                password: password,
                userId: getUserId,
            },
        });
        if (created) {
            console.log(auth, authCreated);
            return true;
        }
        if (!created) {
            return false;
        }
    }
    catch (e) {
        console.log(e);
    }
}
exports.creteUser = creteUser;
async function AuthToken(userData) {
    try {
        const email = userData.email;
        const password = getSHA256ofString(userData.password.toString());
        const auth = await models_2.Auth.findOne({
            where: { email: email, password: password },
        });
        if (auth) {
            const token = jwt.sign({ userId: auth.get("userId") }, index_1.SECRET);
            return { verified: true, token: token };
        }
        else {
            return { verified: false };
        }
    }
    catch (e) {
        console.log(e);
    }
}
exports.AuthToken = AuthToken;
async function updateUser(userData) {
    const updateUser = await models_1.User.update(userData, {
        where: {
            email: userData.email,
        },
    });
    const user = await models_1.User.findOne({
        where: {
            email: userData.email,
        },
    });
    const userId = user.get("id");
    console.log(userId);
    const password = getSHA256ofString(userData.password.toString());
    const updateAuth = models_2.Auth.update({ password: password }, {
        where: { userId: userId },
    });
    return { updateUser: updateUser, updateAuth: updateAuth };
}
exports.updateUser = updateUser;
async function middleware(req, res, next) {
    const authorization = req.get("Authorization");
    const verification = jwt.verify(authorization.split(" ")[1], index_1.SECRET);
    const userInfo = await models_1.User.findOne({
        where: {
            id: verification.userId,
        },
    });
    if (userInfo) {
        req._userInfo = userInfo;
        next();
    }
    else {
        req._userInfo = { user: false };
    }
    // res.status(401).json({ error: "Unauthorized" });
}
exports.middleware = middleware;
