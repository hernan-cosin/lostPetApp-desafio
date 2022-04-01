"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.UserInformation = exports.updateUser = exports.AuthToken = exports.passRestore = exports.creteUser = exports.emailCheck = void 0;
const models_1 = require("../models/models");
const models_2 = require("../models/models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const index_1 = require("../index");
const sendgrid_1 = require("../lib/sendgrid");
const async_1 = require("nanoid/async");
// crear contraseña provisoria con nanoid
async function newPass() {
    const newPass = await (0, async_1.nanoid)(10);
    return newPass;
}
// encriptar contraseña
function getSHA256ofString(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}
// chequear si el mail existe en la DB
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
// crear nuevo usuario en la DB
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
// enviar contraseña provisoria
async function passRestore(userData) {
    try {
        const newPassword = await newPass();
        const contraseña = getSHA256ofString(newPassword.toString());
        const updateAuthPass = await models_2.Auth.update({ password: contraseña }, {
            where: {
                email: userData.userEmail,
            },
        });
        if (updateAuthPass[0] == 1) {
            const info = {
                to: userData.userEmail,
                from: `${process.env.EMAIL}`,
                subject: `Mascotas perdidas: recuperar contraseña`,
                html: `
      <strong>Recuperar contraseña</strong>
      <p>Hemos generado una contraseña automática para que puedas ingresar a tu cuenta y generar una nueva.</p>
      <p>Nueva contraseña: ${newPassword}.</p>
    `,
            };
            const response = sendgrid_1.sgMail.send(info).then(() => {
                return true;
            }, (error) => {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body);
                }
                return false;
            });
            return response;
        }
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.passRestore = passRestore;
// entregar token de autenticación
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
// function auxiliar
// actualizar la informacion del modelo User
async function userUpdate(data) {
    try {
        const updateUser = await models_1.User.update(data, {
            where: {
                email: data.email,
            },
        });
        return updateUser;
    }
    catch (e) {
        console.log(e);
    }
}
// function auxiliar
// actualizar la informacion del modelo Auth
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
            return { updateAuth };
        }
    }
    catch (e) {
        console.log(e);
    }
}
// actualizar informacion del usuario
async function updateUser(userData) {
    try {
        if (userData.name &&
            userData.lastName &&
            userData.password &&
            userData.password1) {
            const userUpdateRes = userUpdate(userData);
            const authUpdateRes = authUpdate(userData);
            if (userUpdateRes && authUpdateRes) {
                return { updatedUserAndAuth: true };
            }
        }
        if (userData.password && userData.password1) {
            const authUpdateRes = authUpdate(userData);
            return { authUpdate: true };
        }
        if (userData.name || userData.lastName) {
            const updateUser = await models_1.User.update(userData, {
                where: {
                    email: userData.email,
                },
            });
            return { userUpdate: true };
        }
    }
    catch (e) {
        console.log(e);
    }
}
exports.updateUser = updateUser;
// obtener datos del usuario para mostrarlos
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
// verificación de autenticación del usuario
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
