"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishAgainPet = exports.unpublishPet = exports.setFoundPet = exports.petsNearLocation = exports.getMyPets = exports.updatePet = exports.createPet = void 0;
const models_1 = require("../models/models");
const models_2 = require("../models/models");
const models_3 = require("../models/models");
const cloudinary_1 = require("../lib/cloudinary");
const algolia_1 = require("../lib/algolia");
// crear nueva mascota en la DB
// subir la imagen a cloudinary, obtener la url
// subir la información a algolia
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
// actualizar la información en la DB
// subir la nueva imagen a cloudinary, obtener la url
// actualizar la información en algolia
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
// obtener todos las mascotas de un usuario
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
// obtener las mascotas cercanas a una ubicación en un rango de un Km
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
// setear mascota como encontrada
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
// setear mascota como encontrada
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
// volver a setear mascota como perdida
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
