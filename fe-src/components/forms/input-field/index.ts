export function initInputField() {
  class initInputField extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const label = document.createElement("label");

      label.setAttribute("class", "label");
      const labelName = this.getAttribute("label");
      label.setAttribute("for", "${labelName}");
      const type = this.getAttribute("type");

      label.innerHTML = `${labelName}
            <input type="${type}" class="input" id="${labelName}">
        `;

      const style = document.createElement("style");
      style.innerHTML = `
          .label {
              display: block;
              box-sizing: border-box;
              max-width: 350px;
              width: 100%;
              color: var(--dark);
              font-family: Poppins, sans-serif;
              text-transform: uppercase;
              margin: 30px auto 0 auto;
          }

          .input {
              box-sizing: border-box;
              max-width: 350px;
              width: 100%;
              height: 50px;
              border-radius: 4px;
              font-family: 'Poppins', sans-serif;
              font-size: 16px;
              border: 2px solid var(--black);
              padding: 0 0 0 15px;
          }
        `;

      label.appendChild(style);
      this.shadow.appendChild(label);
    }
  }
  customElements.define("input-field", initInputField);
}
