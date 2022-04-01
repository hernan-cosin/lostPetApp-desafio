import { Router } from "../../router";
import { state } from "../../state";

class NearByMePage extends HTMLElement {
  shadowRoot: ShadowRoot;
  connectedCallback() {
    this.render();
    this.menuInteraction();
    this.nearByPets();
  }

  render() {
    this.innerHTML = `
            <header class="header">
                <c-header class="header-component"></c-header>
            </header>
              <section class="main">
                <div class="content">
                  <c-text size="40" weight="700" capitalize="false" class="title">Mascotas perdidas cerca tuyo</c-text>
                  <div class="near-pets-container"></div>
                </div>
              </section>
        `;

    const style = document.createElement("style");

    style.innerHTML = `
        .header {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
        }

        .header-component {
            display: block;
        }

        .main {
          background: var(--principal);
          min-height: 100vh;
          height: auto;
          padding: 110px 20px 0 20px;
        }

        .content {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .report-info {
          display: block;
          margin: 0 auto;
          background-color: #818181c2;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 5;
          padding: 100px 10px 0 10px;
          backdrop-filter: blur(6px);
          height: 250vh;
        }

        .title {
          max-width: 350px;
          margin: 0 auto 50px auto;
          display: block;
        }

        .text {
          max-width: 350px;
          margin: 0 auto 20px auto;
          display: block;
        }

        .button {
          display: block;
          text-align: center;
        }

        .near-pets-container{
          margin: 20px auto 0 auto;
          padding: 0 0 20px 0;
        }

        .no-pets-near-message {
          max-width: 350px;
          margin: 0 auto;
          display: block;
      }
        }
        `;

    this.appendChild(style);
  }
  menuInteraction() {
    // BOTONES
    const logoutButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".logout")
      .shadowRoot.querySelector(".text");

    const myDataButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".data")
      .shadowRoot.querySelector(".text");

    const myReportedPetsButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".my-reports")
      .shadowRoot.querySelector(".text");

    const reportPetButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".report")
      .shadowRoot.querySelector(".text");

    // //LISTENERS
    // LOGOUT
    logoutButton.addEventListener("click", () => {
      state.logout();
      Router.go("/");
    });

    const menuOptionButton = [
      myDataButton,
      myReportedPetsButton,
      reportPetButton,
    ];

    menuOptionButton.forEach((buttonEl) => {
      buttonEl.addEventListener("click", () => {
        const token = state.getToken();

        if (!token) {
          // si no hay token setea el path en el state para ir luego de ingresar y recibir token.
          if (buttonEl.innerHTML.includes("datos")) {
            state.setPath("/user-data");
          }
          if (buttonEl.innerHTML.includes("mascota")) {
            state.setPath("/report-pet");
          }
          if (buttonEl.innerHTML.includes("mascotas")) {
            state.setPath("/my-reports");
          }
          return Router.go("/signup-in");
        }
        // si hay token setea el path en el state y el router redirige hacia el botón seleccionado
        if (buttonEl.innerHTML.includes("datos")) {
          state.setPath("/user-data");
        }
        if (buttonEl.innerHTML.includes("mascota")) {
          state.setPath("/report-pet");
        }
        if (buttonEl.innerHTML.includes("mascotas")) {
          state.setPath("/my-reports");
        }
        Router.go(state.getState().path);
      });
    });
  }
  nearByPets() {
    const nearByMePets = state.getPetsNearBy();
    const nearPetsContainer = this.querySelector(".near-pets-container");

    nearByMePets
      .then((data) => {
        // obtiene las mascotas cercanas
        data.petsNearLocationResponse.forEach((pet) => {
          if (pet.status == "found" || pet.deleted == "true") {
            // si como estatus tienen encontradas o eliminadas las saltea
            return;
          } else {
            // sino crea las cards
            const nearPetCard = document.createElement("pet-card");
            nearPetCard.setAttribute("title", pet.name);
            nearPetCard.setAttribute("location", pet.petZone);
            nearPetCard.setAttribute("imgSrc", pet.imgUrl);
            nearPetCard.setAttribute("petId", pet.id);
            nearPetCard.setAttribute("petDescription", pet.description);
            nearPetCard.setAttribute("editable", "false");
            nearPetsContainer.appendChild(nearPetCard);

            nearPetCard.addEventListener("reportEvent", (e: any) => {
              // escucha al evento de click en el boton de reportar mascota
              const contentContainer = this.querySelector(".content");
              const petId = e.detail.petId;
              const petName = e.detail.petName;

              // crea el formulario de rerporte
              const reportInfoPopForm = document.createElement("report-form");
              reportInfoPopForm.setAttribute("petName", petName);
              reportInfoPopForm.setAttribute("class", "report-info");

              // lo apendea
              contentContainer.insertBefore(
                reportInfoPopForm,
                contentContainer.firstChild
              );

              const closeButton =
                reportInfoPopForm.shadowRoot.querySelector(".close-button");

              closeButton.addEventListener("click", () => {
                contentContainer.firstChild.remove();
              });

              const sendInformationButton = reportInfoPopForm.shadowRoot
                .querySelector(".form-button")
                .shadowRoot.querySelector(".button");

              const reporterName = reportInfoPopForm.shadowRoot
                .querySelector(".form-name-input")
                .shadowRoot.querySelector(".input") as any;

              const reporterCellphone = reportInfoPopForm.shadowRoot
                .querySelector(".form-cel-input")
                .shadowRoot.querySelector(".input") as any;

              const lastSeenLocation = reportInfoPopForm.shadowRoot
                .querySelector(".form-location-input")
                .shadowRoot.querySelector(".text-area") as any;

              const errorMessage =
                reportInfoPopForm.shadowRoot.querySelector(".error-message");

              sendInformationButton.addEventListener("click", async () => {
                if (
                  reporterName.value == "" ||
                  reporterCellphone.value == "" ||
                  lastSeenLocation.value == ""
                ) {
                  return (errorMessage.textContent =
                    "Alguno de tus datos está incompleto");
                } else {
                  const ownerEmail = pet.user.email;

                  const reporterNameValue = reporterName.value;
                  const reporterCelValue = reporterCellphone.value;
                  const lastSeenLocationValue = lastSeenLocation.value;

                  const reportInfo = {
                    reporterName: reporterNameValue,
                    cellphone: reporterCelValue,
                    lastSeen: lastSeenLocationValue,
                    petId: petId,
                  };

                  const sendReportResponse = state.sendReport(reportInfo);
                  sendReportResponse.then((data) => {
                    if (data.reportCreated == true) {
                      const sendgridEmailInfo = {
                        to: ownerEmail,
                        email: process.env.EMAIL, // Use the email address or domain you verified above
                        reporterNameValue: reporterNameValue,
                        petName: petName,
                        lastSeenLocationValue: lastSeenLocationValue,
                        reporterCelValue: reporterCelValue,
                      };

                      const sendgrid = state.sendEmail(sendgridEmailInfo);
                      sendgrid.then((data) => {
                        if (data.sendEmailController == true) {
                          contentContainer.firstChild.remove();
                        }
                      });
                    }
                  });
                }
              });
            });
          }
        });
      })
      .then(() => {
        if (!nearPetsContainer.hasChildNodes()) {
          // si no se apendeo ninguna mascota muestra mensaje
          const noPetsNearMessage = document.createElement("c-text");
          noPetsNearMessage.setAttribute("class", "no-pets-near-message");
          noPetsNearMessage.setAttribute("size", "16");
          noPetsNearMessage.setAttribute("weight", "500");
          noPetsNearMessage.textContent =
            "No hay mascotas perdidas cerca tuyo en este momento.";

          nearPetsContainer.appendChild(noPetsNearMessage);
        }
      });
  }
}
customElements.define("nearbyme-page", NearByMePage);
