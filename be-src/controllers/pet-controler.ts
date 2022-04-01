import { Pet } from "../models/models";
import { User } from "../models/models";
import { Report } from "../models/models";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";
import { sgMail } from "../lib/sendgrid";

// crear nueva mascota en la DB
// subir la imagen a cloudinary, obtener la url
// subir la información a algolia
export async function createPet(petData, userId) {
  if (!petData) {
    throw new Error("User was not provided");
  }
  try {
    // CLOUDINARY
    const imgUpload = await cloudinary.uploader.upload(
      petData.imgUrl,
      function (error, result) {}
    );

    // SEQUELIZE
    const [newPet, created] = await Pet.findOrCreate({
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
      const savePet = await index.saveObject({
        objectID: newPet.get("id"),
        name: newPet.get("name"),
        _geoloc: {
          lat: newPet.get("loc_lat"),
          lng: newPet.get("loc_lng"),
        },
      });

      return { created };
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
}

// actualizar la información en la DB
// subir la nueva imagen a cloudinary, obtener la url
// actualizar la información en algolia
export async function updatePet(petInfo) {
  try {
    // CLOUDINARY
    const imgUpload = await cloudinary.uploader.upload(
      petInfo.imgUrl,
      function (error, result) {}
    );

    petInfo.imgUrl = imgUpload.url;

    // SEQUELIZE
    const updatePet = await Pet.update(petInfo, {
      where: { id: petInfo.petId },
    });

    // ALGOLIA
    const algoliaUpdate = await index.partialUpdateObject({
      objectID: petInfo.petId,
      name: petInfo.petName,
      _geoloc: {
        lat: petInfo.loc_lat,
        lng: petInfo.loc_lng,
      },
    });
    return { updated: true };
  } catch (e) {
    console.log(e);
    return { updated: false };
  }
}

// obtener todos las mascotas de un usuario
export async function getMyPets(req) {
  try {
    if (req._userInfo.user == false) {
      return { Error: "unauthorized" };
    } else {
      const pets = await Pet.findAll({
        where: {
          userId: req._userInfo.id,
        },
        include: { model: Report },
      });
      return { pets };
    }
  } catch (e) {
    console.log(e);
  }
}

// obtener las mascotas cercanas a una ubicación en un rango de un Km
export async function petsNearLocation(info) {
  try {
    const lat = info.query.lat;
    const lng = info.query.lng;

    const location = `${lat + "," + lng}`;

    const pets = index
      .search("", {
        aroundLatLng: location,
        aroundRadius: 1000,
      })
      .then(async ({ hits }) => {
        // SEQUELIZE
        let petFromSequelize = [];
        for (const pet of hits) {
          const foundPet = await Pet.findOne({
            where: { id: pet.objectID },
            include: [{ model: User }],
          });
          if (foundPet !== null) {
            petFromSequelize.push(foundPet);
          }
        }

        return petFromSequelize;
      });
    return pets;
  } catch (e) {
    console.log(e);
  }
}

// setear mascota como encontrada
export async function setFoundPet(petInfo) {
  try {
    const updatePet = await Pet.update(petInfo, {
      where: { id: petInfo.id },
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// setear mascota como encontrada
export async function unpublishPet(petInfo) {
  try {
    // SEQUELIZE
    const updatePet = await Pet.update(petInfo, {
      where: { id: petInfo.id },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// volver a setear mascota como perdida
export async function publishAgainPet(petInfo) {
  try {
    // SEQUELIZE
    const updatePet = await Pet.update(petInfo, {
      where: { id: petInfo.id },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// crear reporte de mascota en la DB
export async function reportPet(reportInfo, petId) {
  if (!reportInfo) {
    throw new Error("Report info was not provided");
  }
  try {
    const newReport = await Report.create({
      reporterName: reportInfo.reporterName,
      cellphone: reportInfo.cellphone,
      lastSeen: reportInfo.lastSeen,
      petId: petId,
    });

    if (newReport.get("id")) {
      return true;
    }
  } catch (e) {
    return false;
    console.log(e);
  }
}

// enviar email del reporte al usuario dueño de la mascota
export async function sendEmail(emailInformation) {
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
