import { state } from "../../state";

const editIcon = require("url:../../media/edit.svg");

export function initPetCard() {
  class PetCard extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
      this.editAddListener();
    }

    render() {
      const imgSrc = this.getAttribute("imgSrc");
      const title = this.getAttribute("title");
      const location = this.getAttribute("location");
      const petDescription =
        this.getAttribute("petDescription").length > 0
          ? this.getAttribute("petDescription")
          : "El usuario no incluyó una descripción";
      const editable = this.getAttribute("editable");
      const found = this.getAttribute("found");
      const hasReports = this.getAttribute("hasReports");

      const div = document.createElement("div");
      div.setAttribute("class", "petCard-container");

      if (editable == "true") {
        div.innerHTML = `
                    ${
                      found == "true"
                        ? "<div class='found-tag'>Encontrado</div>"
                        : ""
                    }
                    <img src="${imgSrc}" class="img"/>
                    <div class="title-container">
                      <c-text class="title" size="40" weight="700" capitalize="false" color="black">${title}</c-text>
                      ${
                        hasReports == "true"
                          ? "<c-link class='reports-link'>Ver reportes</c-link>"
                          : ""
                      }
                    </div>
                    <div class="card-body-container">
                        <c-text class="location" size="16" weight="500" capitalize="false">${location}</c-text>
                        <img src="${editIcon}" class="edit">
                    </div>
                    <c-link class="description-link" size="30"> + </c-link>
                    <c-text class="description">Descripción: <span class="br-description">${petDescription}</span></c-text>
                `;
      }
      if (editable == "false") {
        div.innerHTML = `
                  <img src="${imgSrc}" class="img">
                  <c-text class="title" size="40" weight="700" capitalize="false" color="black">${title}</c-text>
                  <div class="card-body-container">
                    <c-text class="location" size="16" weight="500" capitalize="false">${location}</c-text>
                    <c-link class="report-link">Reportar información</c-link> 
                  </div>
                  <c-link class="description-link" size="30"> + </c-link>
                  <c-text class="description">Desripción:
                  ${petDescription}
                  </c-text>
                  `;
      }
      const style = document.createElement("style");
      style.innerHTML = `
        .petCard-container {
            max-width: 335px;
            width: 100%;
            height: auto;
            padding: 0 0 5px 0;
            border-radius: 4px;
            margin: 0 auto 35px auto;
            filter: drop-shadow(2px 4px 6px var(--dark));
            background: var(--principal-inverted)
        }

        .found-tag {
          z-index: 10;
          position: absolute;
          top: 0;
          right: 0;
          background-color: var(--found-tag);
          border-radius: 0 4px 0 4px;
          padding: 2px;
          font-size: 13px;
          filter: drop-shadow(-1px 4px 3px var(--dark));
          color: var(--dark);
          font-family: 'Poppins', sans-serif;
        }

        .img {
            width: 100%;
            object-fit: cover;
            border-radius: 4px;
            filter: drop-shadow(0px 4px 6px var(--dark));
        }

        .title-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .title {
            display: block;
            padding: 0 10px;
            margin: 0 0 5px 0;
        }
        
        .reports-link {
          text-align: right;
          margin: 0 10px 10px 0;
          align-self: flex-end;
        }

        .card-body-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 10px;
            box-shadow: 0px 0px 4px var(--dark);
            border-radius: 4px;
            background: var(--principal-inverted);
        }

        .location {
            display: block;
            max-width: 200px;
            overflow-wrap: break-word;
        }

        .edit {
            cursor: pointer;
            width: 42px;
            height: 42px;
        }

        .report-link {
            display: block;
            text-align: right;
        }

        .description-link {
          display: block;
          width: fit-content;
          padding: 0 0 0 10px;
          transition: transform .40s;
        } 

        .description-link.toggle {
          transform: rotate(90deg);
        }

        .description {
          display: block;
          height: 0;
          padding: 0 0 0 10px;
          opacity: 0;
          transform: translate(0, -15px);
          transition: opacity .5s, transform .5s, height .5s .25s;
        }

        .description.toggle {
          opacity: 1;
          transform: translate(0, 0);
          height: auto;
        }

        .link-report{
          font-size: 16px;
          font-weight: 400;
          font-family: 'Poppins', sans-serif;
          margin: 0;
          color: var(--link);
          cursor: pointer;
          text-transform: none;
        }
      `;

      div.appendChild(style);
      this.shadow.appendChild(div);
    }
    editAddListener() {
      const petId = this.getAttribute("petId");
      const editButton = this.shadowRoot.querySelector(".edit");
      // // LINK TO THE REPORTS
      // const reportsLink = this.shadowRoot.querySelector(".reports-link");
      // LINK TO REPORT INFORMATION ABOUT ONE PET
      const reportButton = this.shadowRoot.querySelector(".report-link");

      if (editButton) {
        editButton.addEventListener("click", () => {
          const editEvent = new CustomEvent("editButton", {
            bubbles: true,
            detail: {
              petId: petId,
            },
          });
          this.dispatchEvent(editEvent);
        });
      }

      // // REPORTS LINK CUSTOM EVENT
      // if (reportsLink) {
      //   reportsLink.addEventListener("click", () => {
      //     const editEvent = new CustomEvent("reports-link", {
      //       bubbles: true,
      //       detail: {
      //         petId: petId,
      //       },
      //     });
      //     this.dispatchEvent(editEvent);
      //   });
      // }

      if (reportButton) {
        reportButton.addEventListener("click", () => {
          const reportEvent = new CustomEvent("reportEvent", {
            bubbles: true,
            detail: {
              petId: petId,
              petName: this.getAttribute("title"),
            },
          });
          this.dispatchEvent(reportEvent);
        });
      }

      const descriptionButton =
        this.shadowRoot.querySelector(".description-link");

      const descriptionText = this.shadowRoot.querySelector(".description");

      descriptionButton.addEventListener("click", () => {
        descriptionButton.classList.toggle("toggle");
        descriptionText.classList.toggle("toggle");
      });
    }
  }
  customElements.define("pet-card", PetCard);
}
