export function initButton() {
  class Button extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const color = this.getAttribute("color");
      const button = document.createElement("button");
      button.setAttribute("class", "button");

      button.textContent = `
        ${this.textContent}
            `;

      const style = document.createElement("style");
      style.innerHTML = `
        .button {
            box-sizing: border-box;
            max-width: 350px;
            width: 100%;
            height: 50px;
            border-radius: 4px;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: var(--black);
            background: ${
              color == "yellow" ? "var(--button)" : "var(--grey-button)"
            };
            border: none;
            cursor: pointer;
        }

      `;

      button.appendChild(style);
      this.shadow.appendChild(button);
    }
  }
  customElements.define("c-button", Button);
}
