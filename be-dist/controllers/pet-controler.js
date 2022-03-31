"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.reportPet = exports.publishAgainPet = exports.unpublishPet = exports.setFoundPet = exports.petsNearLocation = exports.getMyPets = exports.updatePet = exports.createPet = void 0;
const models_1 = require("../models/models");
const models_2 = require("../models/models");
const models_3 = require("../models/models");
const cloudinary_1 = require("../lib/cloudinary");
const algolia_1 = require("../lib/algolia");
const sendgrid_1 = require("../lib/sendgrid");
async function createPet(petData, userId) {
    if (!petData) {
        throw new Error("User was not provided");
    }
    try {
        // CLOUDINARY
        const imgUpload = await cloudinary_1.cloudinary.uploader.upload(petData.imgUrl, function (error, result) { });
        // SEQUELIZE
        const [newPet, created] = await models_1.Pet.findOrCreate({
            where: { name: petData.petName, userId: userId },
            defaults: {
                name: petData.petName,
                description: petData.petDescription,
                imgUrl: imgUpload.url,
                status: petData.status,
                userId: userId,
                loc_lat: petData.loc_lat,
                loc_lng: petData.loc_lng,
                petZone: petData.petZone,
                deleted: petData.deleted,
            },
        });
        // ALGOLIA
        if (created) {
            const savePet = await algolia_1.index.saveObject({
                objectID: newPet.get("id"),
                name: newPet.get("name"),
                _geoloc: {
                    lat: newPet.get("loc_lat"),
                    lng: newPet.get("loc_lng"),
                },
            });
            return { created };
        }
        else {
            return false;
        }
    }
    catch (e) {
        console.log(e);
    }
}
exports.createPet = createPet;
async function updatePet(petInfo) {
    try {
        // CLOUDINARY
        const imgUpload = await cloudinary_1.cloudinary.uploader.upload(petInfo.imgUrl, function (error, result) { });
        petInfo.imgUrl = imgUpload.url;
        // SEQUELIZE
        const updatePet = await models_1.Pet.update(petInfo, {
            where: { id: petInfo.petId },
        });
        // ALGOLIA
        const algoliaUpdate = await algolia_1.index.partialUpdateObject({
            objectID: petInfo.petId,
            name: petInfo.petName,
            _geoloc: {
                lat: petInfo.loc_lat,
                lng: petInfo.loc_lng,
            },
        });
        return { updated: true };
    }
    catch (e) {
        console.log(e);
        return { updated: false };
    }
}
exports.updatePet = updatePet;
async function getMyPets(req) {
    try {
        if (req._userInfo.user == false) {
            return { Error: "unauthorized" };
        }
        else {
            const pets = await models_1.Pet.findAll({
                where: {
                    userId: req._userInfo.id,
                },
                include: { model: models_3.Report },
            });
            return { pets };
        }
    }
    catch (e) {
        console.log(e);
    }
}
exports.getMyPets = getMyPets;
async function petsNearLocation(info) {
    try {
        const lat = info.query.lat;
        const lng = info.query.lng;
        const location = `${lat + "," + lng}`;
        const pets = algolia_1.index
            .search("", {
            aroundLatLng: location,
            aroundRadius: 1000,
        })
            .then(async ({ hits }) => {
            // SEQUELIZE
            let petFromSequelize = [];
            for (const pet of hits) {
                const foundPet = await models_1.Pet.findOne({
                    where: { id: pet.objectID },
                    include: [{ model: models_2.User }],
                });
                if (foundPet !== null) {
                    petFromSequelize.push(foundPet);
                }
            }
            return petFromSequelize;
        });
        return pets;
    }
    catch (e) {
        console.log(e);
    }
}
exports.petsNearLocation = petsNearLocation;
async function setFoundPet(petInfo) {
    try {
        const updatePet = await models_1.Pet.update(petInfo, {
            where: { id: petInfo.id },
        });
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.setFoundPet = setFoundPet;
async function unpublishPet(petInfo) {
    try {
        // SEQUELIZE
        const updatePet = await models_1.Pet.update(petInfo, {
            where: { id: petInfo.id },
        });
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.unpublishPet = unpublishPet;
async function publishAgainPet(petInfo) {
    try {
        // SEQUELIZE
        const updatePet = await models_1.Pet.update(petInfo, {
            where: { id: petInfo.id },
        });
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.publishAgainPet = publishAgainPet;
async function reportPet(reportInfo, petId) {
    if (!reportInfo) {
        throw new Error("Report info was not provided");
    }
    try {
        const newReport = await models_3.Report.create({
            reporterName: reportInfo.reporterName,
            cellphone: reportInfo.cellphone,
            lastSeen: reportInfo.lastSeen,
            petId: petId,
        });
        if (newReport.get("id")) {
            return true;
        }
    }
    catch (e) {
        return false;
        console.log(e);
    }
}
exports.reportPet = reportPet;
async function sendEmail(emailInformation) {
    const info = {
        to: emailInformation.to,
        from: emailInformation.email,
        subject: `Mascotas perdidas Reporte de ${emailInformation.petName}`,
        html: `
  <strong>Mascotas perdidas Reporte</strong>
  <p>${emailInformation.reporterNameValue} ha visto a tu mascota reportada, ${emailInformation.petName}.</p>
  <p>Este es el mensaje sobre donde lo vio: "${emailInformation.lastSeenLocationValue}".</p>
  <p>Su número de contacto es: ${emailInformation.reporterCelValue}</p>
  <p>Esperamos que te sea de utilidad la información y te reencuentres pronto con tu mascota.</p>
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
exports.sendEmail = sendEmail;
