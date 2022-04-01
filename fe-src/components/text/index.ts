export function initText() {
  class Text extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const content = this.textContent;
      const size = this.getAttribute("size") || 18;
      const weight = this.getAttribute("weight") || 400;
      const capitalize = this.getAttribute("capitalize");
      const color = this.getAttribute("color") || "dark";

      const p = document.createElement("p");
      p.setAttribute("class", "text");

      p.innerHTML = `
            ${content}
              `;

      const style = document.createElement("style");
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .text {
            font-size: ${size}px;
            font-weight: ${weight};
            text-transform: ${capitalize == "true" ? "uppercase" : "none"};
            font-family: 'Poppins', sans-serif;
            margin: 0;
            color: var(--${color});
          }
        `;

      p.appendChild(style);
      this.shadow.appendChild(p);
    }
  }
  customElements.define("c-text", Text);
}
