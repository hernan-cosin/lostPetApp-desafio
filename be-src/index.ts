import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import "dotenv/config";
import { User, Auth, Pet, Report } from "./models/models";
import {
  emailCheck,
  creteUser,
  AuthToken,
  middleware,
  updateUser,
  UserInformation,
  passRestore,
} from "./controllers/user-controller";
import {
  createPet,
  updatePet,
  getMyPets,
  petsNearLocation,
  setFoundPet,
  unpublishPet,
  publishAgainPet,
} from "./controllers/pet-controler";
import { reportPet, sendEmail } from "./controllers/report-controller";

var corsOptions = {
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  //   origin: [
  //     "https://m7-lost-pet-app.herokuapp.com",
  //     "https://dwf-m8-457b3.web.app",
  //     "https://dwf-m8-457b3.firebaseapp.com",
  //   ],
};

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

const app = express();

// app.use(cors());
// app.options("*", cors());
app.use(express.json({ limit: "50mb" }));

app.get("/test", async (req, res) => {
  res.json({ test: true });
});

app.post("/email-check", async (req, res) => {
  const response = await emailCheck(req.body.email);
  res.json({ userFound: response });
});

app.post("/auth", async (req, res) => {
  const response = await creteUser(req.body);
  res.json({ response });
});

app.put("/pass", async (req, res) => {
  const passRestoreRes = await passRestore(req.body);
  return res.json({ passRestoreRes });
});

app.post("/auth/token", async (req, res) => {
  const result = await AuthToken(req.body);

  if (result.verified == true) {
    res.json({ verified: result.verified, token: result.token });
  } else {
    res.json({ verified: false });
  }
});

app.put("/user", middleware, async (req, res) => {
  const result = await updateUser(req.body);
  res.json(result);
});

app.get("/me", middleware, async (req, res) => {
  const userInformationResponse = await UserInformation(req);

  if (userInformationResponse["Error"] == "unauthorized") {
    return res.json({ Error: "unauthorized" });
  } else {
    return res.json(userInformationResponse);
  }
});

app.post("/pet", middleware, async (req, res) => {
  try {
    const userId = req._userInfo.id;

    const response = await createPet(req.body, userId);

    res.json({ response });
  } catch (e) {
    throw new Error("Missing some data");
  }
});

app.put("/pet", middleware, async (req, res) => {
  const result = await updatePet(req.body);
  res.json(result);
});

app.get("/my-pets", middleware, async (req, res) => {
  const myPets = await getMyPets(req);

  if (myPets.Error == "unauthorized") {
    return res.json({ Error: "unauthorized" });
  } else {
    return res.json(myPets);
  }
});

app.get("/pets-near-location", async (req, res) => {
  const petsNearLocationResponse = await petsNearLocation(req);

  return res.json({ petsNearLocationResponse });
});

app.put("/pet/found", async (req, res) => {
  const setFoundPetResponse = await setFoundPet(req.body);

  if (setFoundPetResponse == true) {
    return res.json({ setFoundPet: true });
  }
  if (setFoundPetResponse == false) {
    return res.json({ setFoundPet: false });
  }
});

app.put("/pet/unpublish", async (req, res) => {
  const unpublisPetResponse = await unpublishPet(req.body);

  if (unpublisPetResponse == true) {
    return res.json({ unpublished: true });
  }
  if (unpublisPetResponse == false) {
    return res.json({ unpublished: false });
  }
});

app.put("/pet/publish-again", async (req, res) => {
  const publishAgainPetResponse = await publishAgainPet(req.body);

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

  const createReportResponse = await reportPet(reportInfo, petId);
  if (createReportResponse) {
    return res.json({ reportCreated: true });
  }
  if (!createReportResponse) {
    return res.json({ reportCreated: false });
  }
});

app.post("/send-email", async (req, res) => {
  const sendEmailController = await sendEmail(req.body);
  return res.json({ sendEmailController });
});

app.use(express.static("fe-dist"));

app.get("*", (req, res) => {
  const ruta = path.resolve(__dirname, "../fe-dist/index.html");
  res.sendFile(ruta);
});

app.post("/allusers", async (req, res) => {
  try {
    const allUsers = await User.findAll();
    res.send(allUsers);
  } catch (e) {
    console.log(e);
  }
});

app.post("/allauth", async (req, res) => {
  try {
    const allAuth = await Auth.findAll();
    res.send(allAuth);
  } catch (e) {
    console.log(e);
  }
});

app.post("/allpets", async (req, res) => {
  try {
    const allPets = await Pet.findAll({
      include: {
        model: Report,
      },
    });
    res.send(allPets);
  } catch (e) {
    console.log(e);
  }
});

app.post("/allreports", async (req, res) => {
  try {
    const allReports = await Report.findAll({ include: Pet });
    res.send(allReports);
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});

export { SECRET };
