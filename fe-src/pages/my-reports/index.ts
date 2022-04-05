import { Router } from "../../router";
import { state } from "../../state";

import { menuInteraction } from "../../index";
class MyReportsPage extends HTMLElement {
  shadowRoot: ShadowRoot;
  connectedCallback() {
    state.resetEditPetId();
    this.render();
    menuInteraction(this);
    this.displayMyPetsCards();
  }

  render() {
    this.innerHTML = `
            <header class="header">
                <c-header class="header-component"></c-header>
            </header>
              <section class="main">
                <div class="content">
                  <c-text size="40" weight="700" capitalize="false" class="title">Mis mascotas reportadas</c-text>
                  <div class="my-pets-container">

                  </div>
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
        }

        .header-component {
            display: block;
        }

        .main {
          background: var(--principal);
          min-height: 100vh;
          padding: 110px 20px 40px 20px;
        }

        .content {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .message-container {
          display: block;
          max-width: 350px;
          margin: 0 auto;
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
        `;

    this.appendChild(style);
  }
  displayMyPetsCards() {
    const myPetsContainer = this.querySelector(".my-pets-container");

    state.getMyPets().then((res) => {
      if (res.pets.length == 0) {
        // si no hay mascotas reportadas muestra mensaje
        const messageContainer = document.createElement("c-text");
        messageContainer.setAttribute("class", "message-container");
        messageContainer.setAttribute("capitalize", "true");
        messageContainer.textContent = `Aun no reportaste mascotas perdidas.`;

        return myPetsContainer.appendChild(messageContainer);
      }
      if (res.pets.length > 0) {
        // si encuentra mascotas crea las cards y las apendea
        res.pets.forEach((pet) => {
          if (pet.deleted == "true") {
            return;
          } else {
            const petCard = document.createElement("pet-card");
            pet.status == "found" ? petCard.setAttribute("found", "true") : "";
            petCard.setAttribute("imgSrc", `${pet.imgUrl}`);
            petCard.setAttribute("title", `${pet.name}`);
            petCard.setAttribute("location", `${pet.petZone}`);
            petCard.setAttribute("editable", "true");
            petCard.setAttribute("petId", `${pet.id}`);
            petCard.setAttribute("petDescription", `${pet.description}`);

            myPetsContainer.appendChild(petCard);
            petCard.addEventListener("editButton", (e: any) => {
              const petId = e.detail.petId;

              state.setEditPetId(petId);

              Router.go("/report-pet");
            });

            // button para acceder a los reportes que tenga cada mascota.
            // REPORTS LINK
            // if (pet.reports.length > 0) {
            //   petCard.setAttribute("hasReports", "true");
            // }

            // REPORTS LINK EVENT
            // petCard.addEventListener("reports-link", (e: any) => {
            //   const petId = e.detail.petId;
            //   console.log(petId);
            // });
          }
        });
      }
    });
  }
}
customElements.define("my-reports-page", MyReportsPage);
