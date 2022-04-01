const logo = require("url:../../media/logo.svg");
import { Router } from "../../router";

export function initLogo() {
  class Logo extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
      this.logoInteraction();
    }

    render() {
      const div = document.createElement("div");
      div.setAttribute("class", "logo-container");

      div.innerHTML = `
                <img src="${logo}" alt="logo" class="svg logo">
                <p class="title">MASCOTAS PERDIDAS</p>
            `;

      const style = document.createElement("style");
      style.innerHTML = `
        .logo-container {
            display: flex;
            flex-direction: row;
            align-self: flex-start;
            justify-content: flex-start;
            align-items: center;
        }

        .svg {
            display: inline-block;
            margin: 10px 0 0 0;
            width: 65px;
            filter: drop-shadow(1px 2px 3px white);
        }

        .title {
          margin: 0;
          font-family: 'Stick No Bills', sans-serif;
          font-size: 24px;
          width: 100px;
        }
      `;
      div.appendChild(style);
      this.shadow.appendChild(div);
    }
    logoInteraction() {
      const logoEl = this.shadowRoot.querySelector(".logo-container");
      logoEl.addEventListener("click", () => {
        Router.go("/");
      });
    }
  }
  customElements.define("catdog-logo", Logo);
}
