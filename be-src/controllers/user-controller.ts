import { User } from "../models/models";
import { Auth } from "../models/models";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { SECRET } from "../index";
import { sgMail } from "../lib/sendgrid";
import { nanoid } from "nanoid/async";

// crear contraseña provisoria con nanoid
async function newPass() {
  const newPass = await nanoid(10);
  return newPass;
}

// encriptar contraseña
function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

// chequear si el mail existe en la DB
export async function emailCheck(email) {
  const user = await User.findAll({
    where: {
      email: email,
    },
  });

  if (user.length == 0) {
    return false;
  } else {
    return true;
  }
}

// crear nuevo usuario en la DB
export async function creteUser(userData) {
  try {
    const password = getSHA256ofString(userData.password.toString());
    const password1 = getSHA256ofString(userData.password1.toString());

    if (password !== password1) {
      throw new Error("Las contraseñas deben coincidir");
    }

    const [user, created] = await User.findOrCreate({
      where: { email: userData.email },
      defaults: {
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
      },
    });

    const getUserId = user.get("id");

    const [auth, authCreated] = await Auth.findOrCreate({
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
  } catch (e) {
    console.log(e);
  }
}

// enviar contraseña provisoria
export async function passRestore(userData) {
  try {
    const newPassword = await newPass();

    const contraseña = getSHA256ofString(newPassword.toString());

    const updateAuthPass = await Auth.update(
      { password: contraseña },
      {
        where: {
          email: userData.userEmail,
        },
      }
    );

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
      const response = sgMail.send(info).then(
        () => {
          return true;
        },
        (error) => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
          return false;
        }
      );
      return response;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

// entregar token de autenticación
export async function AuthToken(userData) {
  try {
    const email = userData.email;

    const password = getSHA256ofString(userData.password.toString());

    const auth = await Auth.findOne({
      where: { email: email, password: password },
    });

    if (auth) {
      const token = jwt.sign({ userId: auth.get("userId") }, SECRET);
      return { verified: true, token: token };
    } else {
      return { verified: false };
    }
  } catch (e) {
    console.log(e);
  }
}

// function auxiliar
// actualizar la informacion del modelo User
async function userUpdate(data) {
  try {
    const updateUser = await User.update(data, {
      where: {
        email: data.email,
      },
    });
    return updateUser;
  } catch (e) {
    console.log(e);
  }
}

// function auxiliar
// actualizar la informacion del modelo Auth
async function authUpdate(data) {
  try {
    const user = await User.findOne({
      where: {
        email: data.email,
      },
    });

    const userId = user.get("id");
    if (data.password) {
      const password = getSHA256ofString(data.password.toString()) as any;

      const updateAuth = await Auth.update(
        { password: password },
        {
          where: { userId: userId },
        }
      );

      return { updateAuth };
    }
  } catch (e) {
    console.log(e);
  }
}

// actualizar informacion del usuario
export async function updateUser(userData) {
  try {
    if (
      userData.name &&
      userData.lastName &&
      userData.password &&
      userData.password1
    ) {
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
      const updateUser = await User.update(userData, {
        where: {
          email: userData.email,
        },
      });
      return { userUpdate: true };
    }
  } catch (e) {
    console.log(e);
  }
}

// obtener datos del usuario para mostrarlos
export async function UserInformation(req) {
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

// verificación de autenticación del usuario
export async function middleware(req, res, next) {
  const authorization = req.get("Authorization");
  const verification = jwt.verify(authorization.split(" ")[1], SECRET);

  const userInfo = await User.findOne({
    where: {
      id: verification.userId,
    },
  });

  if (userInfo) {
    req._userInfo = userInfo;

    next();
  } else {
    req._userInfo = { user: false };
  }
}
