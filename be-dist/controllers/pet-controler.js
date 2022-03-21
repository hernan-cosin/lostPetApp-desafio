"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPet = void 0;
const models_1 = require("../models/models");
const cloudinary_1 = require("../lib/cloudinary");
const algolia_1 = require("../lib/algolia");
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
            // console.log("CREATED", created);
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
