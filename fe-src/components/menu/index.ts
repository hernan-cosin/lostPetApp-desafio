export function initMenu() {
  class Menu extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const div = document.createElement("div");
      div.setAttribute("class", "menu-container");

      div.innerHTML = `
                <div class="line one"></div>
                <div class="line two"></div>
            `;

      const style = document.createElement("style");
      style.innerHTML = `
        .menu-container {
            display: flex;
            flex-direction: column;
            height: 30px;
            justify-content: space-around;
            box-sizing: border-box;
            margin: 15px 0 0 0;
            cursor: pointer;
        }

        .line{
          width: 35px;
          height: 5px;
          border-radius: 4px;
          background-color: var(--black);
          transition: .5s ease;
        }

        .line.one.open {
          transform: rotate(45deg) translate(5px,5px);
        }

        .line.two.open {
          transform: rotate(315deg) translate(5px,-5px);
        }
      `;

      div.appendChild(style);
      this.shadow.appendChild(div);
    }
  }
  customElements.define("c-menu", Menu);
}
