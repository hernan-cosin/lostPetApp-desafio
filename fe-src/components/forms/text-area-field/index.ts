export function initTextAreaField() {
  class initTextAreaField extends HTMLElement {
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
      // const type = this.getAttribute("type");
      // type="${type}"
      label.innerHTML = `${labelName}
            <textarea  class="text-area" id="${labelName}"></textarea>
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

          .text-area {
              box-sizing: border-box;
              max-width: 350px;
              width: 100%;
              height: 150px;
              border-radius: 4px;
              font-family: 'Poppins', sans-serif;
              font-size: 16px;
              border: 2px solid var(--black);
              padding: 5px 0 0 15px;
            }
        `;

      label.appendChild(style);
      this.shadow.appendChild(label);
    }
  }
  customElements.define("text-area-field", initTextAreaField);
}
