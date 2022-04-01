const closeButton = require("url:../../../media/close.svg");

export function initReportForm() {
  class initReportForm extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const formContainer = document.createElement("form");
      const petName = this.getAttribute("petName");

      formContainer.setAttribute("class", "form-container");

      formContainer.innerHTML = `
              <img class="close-button" src=${closeButton}>
              <c-text class="form-title" size="40" weight="700">Reportar información sobre ${petName}</c-text>
              <input-field class="form-name-input" label="Tu nombre" type="text"></input-field>
              <input-field class="form-cel-input" label="Tu teléfono" type="tel"></input-field>
              <text-area-field class="form-location-input" label="¿Donde lo viste?"></text-area-field>
              <div class="error-message"></div>
              <c-button color="yellow" class="form-button">Enviar</c-button>
          `;

      const style = document.createElement("style");
      style.innerHTML = `
            .form-container {
                display: block;
                background-color: var(--white);
                max-width: 410px;
                margin: 0 auto;
                border-radius: 4px;
                padding: 0 10px 30px 10px;
                filter: drop-shadow(2px 4px 6px black);
              }

            .close-button {
                display: block;
                margin: 0 0 0 auto;
                width: 40px;
                cursor: pointer;   
            }

            .form-title {
                display: block;
                padding: 0 0 0 20px;
            }

            .form-name-input {
                display: block;
            }

            .form-cel-input {
                display: block;
            }

            .form-location-input {
                display: block;
                margin: 0 0 10px 0;
            }

            .form-button {
                display: block;
                text-align: center;
            }

            .error-message {
              display: block;
              font-family: sans-serif;
              color: red;
              text-align: center;
            }
          `;

      formContainer.appendChild(style);
      this.shadow.appendChild(formContainer);
    }
  }
  customElements.define("report-form", initReportForm);
}
