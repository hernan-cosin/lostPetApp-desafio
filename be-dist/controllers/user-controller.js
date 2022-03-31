"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.UserInformation = exports.updateUser = exports.AuthToken = exports.creteUser = exports.emailCheck = void 0;
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
async function userUpdate(data) {
    try {
        const updateUser = await models_1.User.update(data, {
            where: {
                email: data.email,
            },
        });
        console.log("UPDATE USER", updateUser);
        return updateUser;
    }
    catch (e) {
        console.log(e);
    }
}
async function authUpdate(data) {
    try {
        const user = await models_1.User.findOne({
            where: {
                email: data.email,
            },
        });
        const userId = user.get("id");
        if (data.password) {
            const password = getSHA256ofString(data.password.toString());
            const updateAuth = await models_2.Auth.update({ password: password }, {
                where: { userId: userId },
            });
            console.log("UPDATE AUTH", updateAuth);
            return { updateAuth };
        }
    }
    catch (e) {
        console.log(e);
    }
}
async function updateUser(userData) {
    try {
        if (userData.name &&
            userData.lastName &&
            userData.password &&
            userData.password1) {
            console.log("entro en primero");
            const userUpdateRes = userUpdate(userData);
            const authUpdateRes = authUpdate(userData);
            if (userUpdateRes && authUpdateRes) {
                return { updatedUserAndAuth: true };
            }
            // const updateUser = await User.update(userData, {
            //   where: {
            //     email: userData.email,
            //   },
            // });
            // const user = await User.findOne({
            //   where: {
            //     email: userData.email,
            //   },
            // });
            // const userId = user.get("id");
            // const password = getSHA256ofString(userData.password.toString()) as any;
            // const updateAuth = await Auth.update(
            //   { password: password },
            //   {
            //     where: { userId: userId },
            //   }
            // );
            //   return { updateUserAndAuth: true };
        }
        if (userData.password && userData.password1) {
            console.log("entro en segundo");
            const authUpdateRes = authUpdate(userData);
            return { authUpdate: true };
        }
        if (userData.name || userData.lastName) {
            console.log("entro en tercero");
            const updateUser = await models_1.User.update(userData, {
                where: {
                    email: userData.email,
                },
            });
            return { userUpdate: true };
        }
        // return { updateUser: updateUser, updateAuth: updateAuth };
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateUser = updateUser;
async function UserInformation(req) {
    if (req._userInfo.user == false) {
        return { Error: "unauthorized" };
    }
    if (req._userInfo.name && req._userInfo.lastName) {
        const userInfo = {
            name: req._userInfo.name,
            lastName: req._userInfo.lastName,
        };
        return userInfo;
    }
}
exports.UserInformation = UserInformation;
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
}
exports.middleware = middleware;
