import { Report } from "../models/models";
import { sgMail } from "../lib/sendgrid";

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
