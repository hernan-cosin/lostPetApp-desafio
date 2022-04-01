export function initLink() {
  class Link extends HTMLElement {
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
      const size = this.getAttribute("size") || 16;
      const weight = this.getAttribute("weight") || 400;
      const capitalize = this.getAttribute("capitalize") || "";

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
              font-family: 'Poppins', sans-serif;
              margin: 0;
              color: var(--link);
              cursor: pointer;
              text-transform: ${capitalize == "true" ? "uppercase" : "none"};
            }
          `;

      p.appendChild(style);
      this.shadow.appendChild(p);
    }
  }
  customElements.define("c-link", Link);
}
