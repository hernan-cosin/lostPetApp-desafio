import { state } from "../../state";
export function initHeader() {
  class Header extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      const sessionInformation = this.sessionInformation();
      if (sessionInformation == "") {
        this.render();
        this.menuInteraction();
      }
      if (sessionInformation.length > 0) {
        this.render(sessionInformation);
        this.menuInteraction();
      }
    }

    render(email?) {
      const div = document.createElement("div");
      div.setAttribute("class", "header-container");

      div.innerHTML = `
                <div class="header-bg">
                    <div class="content">
                      <catdog-logo class="catdoglogo"></catdog-logo>
                      <c-menu class="menu"></c-menu>
                    </div>
                </div>
                <div class="open-menu">
                  <div class="menu-container">
                    <div class="user-info">
                      <c-text size="24" weight="400" class="email-info">${email}</c-text>
                      <c-link class="logout">Cerrar sesión</c-link>
                    </div>
                    <div class="menu-options">
                      <ul class="ul">
                        <li class="li"><c-text size="24" weight="600" class="menu-option data">Mis datos</c-text></li>
                        <li class="li"><c-text size="24" weight="600" class="menu-option my-reports">Mis mascotas reportadas</c-text></li>
                        <li class="li"><c-text size="24" weight="600" class="menu-option report">Reportar mascota</c-text></li>
                      </ul>
                    </div>
                  </div>
                </div>
            `;

      const style = document.createElement("style");
      style.innerHTML = `
        .header-container {
          height: 115px;
        }
        
        .header-bg {
            position: absolute;
            left: 0;
            right: 0;
            z-index: 5;
            background: var(--gradient);
            height: 115px;
            padding: 0 20px 0 10px;
            clip-path: polygon(100% 0%, 0% 0% , 0% 69.33%, 1% 69.32%, 2% 69.29%, 3% 69.24%, 4% 69.17%, 5% 69.08%, 6% 68.97%, 7% 68.84%, 8% 68.69%, 9% 68.52%, 10% 68.34%, 11% 68.13%, 12% 67.91%, 13% 67.67%, 14% 67.41%, 15% 67.14%, 16% 66.85%, 17% 66.55%, 18% 66.24%, 19% 65.91%, 20% 65.56%, 21% 65.21%, 22% 64.84%, 23% 64.46%, 24% 64.08%, 25% 63.68%, 26% 63.28%, 27% 62.87%, 28% 62.45%, 29% 62.03%, 30% 61.60%, 31% 61.17%, 32% 60.74%, 33% 60.30%, 34% 59.87%, 35% 59.43%, 36% 59.00%, 37% 58.57%, 38% 58.14%, 39% 57.71%, 40% 57.30%, 41% 56.88%, 42% 56.48%, 43% 56.08%, 44% 55.69%, 45% 55.31%, 46% 54.93%, 47% 54.57%, 48% 54.23%, 49% 53.89%, 50% 53.57%, 51% 53.26%, 52% 52.97%, 53% 52.69%, 54% 52.43%, 55% 52.18%, 56% 51.95%, 57% 51.74%, 58% 51.55%, 59% 51.37%, 60% 51.21%, 61% 51.08%, 62% 50.96%, 63% 50.86%, 64% 50.78%, 65% 50.72%, 66% 50.69%, 67% 50.67%, 68% 50.67%, 69% 50.69%, 70% 50.74%, 71% 50.80%, 72% 50.88%, 73% 50.98%, 74% 51.11%, 75% 51.25%, 76% 51.41%, 77% 51.59%, 78% 51.79%, 79% 52.00%, 80% 52.23%, 81% 52.48%, 82% 52.75%, 83% 53.03%, 84% 53.33%, 85% 53.64%, 86% 53.97%, 87% 54.30%, 88% 54.65%, 89% 55.02%, 90% 55.39%, 91% 55.77%, 92% 56.17%, 93% 56.57%, 94% 56.97%, 95% 57.39%, 96% 57.81%, 97% 58.24%, 98% 58.66%, 99% 59.10%, 100% 59.53%);
        }

        .content {
          display: flex;
            flex-direction: row;
            justify-content: space-between;
            max-width: var(--max-width);
            margin: 0 auto;
        }

        .catdoglogo {
            display: block;
            cursor: pointer;
        }

        .menu {
            display: block;
        }

        .open-menu {    
          height: calc(100vh - 59px);
          box-sizing: border-box;
          margin: 59px 0 0 0;
          padding: 50px 0 0 0;
          background: var(--principal);
          position: absolute;
          visibility: hidden;
        }

        .open-menu.abierto {
          box-sizing: border-box;
          margin: 59px 0 0 0;
          padding: 55px 0 0 0;
          background: var(--principal-transparent);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1;
          visibility: visible;
          animation: menu 1s;
          backdrop-filter: blur(6px);
        }

        @keyframes menu {
          0%{
            height: calc(100vh - 100vh);
            transform: translateY(-100px);
          }
          100%{
            height: calc(100vh - 100px);
            transform: translateY(0px);
          }
        }

        .open-menu.cerrado > .menu-container.cerrado {
          animation: closeMenuContainer .75s forwards;
        }

        @keyframes closeMenuContainer {
          0% {
            transform: translateY(0px);

          }
          100% {
            transform: translateY(-200px);
          }
        }

        .open-menu.cerrado {
          height: calc(100vh - 100px);
          box-sizing: border-box;
          margin: 100px 0 0 0;
          background: var(--principal-transparent);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1;
          visibility: visible;
          animation: close 1s forwards;
          backdrop-filter: blur(6px);
        }

        @keyframes close {
          0%{
            height: calc(100vh - 100px);
            transform: translateY(0px);
          }
          100%{
            height: calc(100vh - 100vh);
            visibility: hidden;
            transform: translateY(-200px);
          }
        }

        .user-info {
          min-height: 60px;
          visibility: hidden;
        }
        
        .menu-container.abierto > .user-info.active {
          visibility: visible;
        }
        
        .email-info {
          display: block;
          width: fit-content;
          text-align: center;
          margin: 0 auto 10px auto;
        }

        .logout {
          display: block;
          width: fit-content;
          margin: 0 auto;
          text-align: center;
        }

        .ul {
          list-style: none;
          padding: 0;
          margin: 50px 0 0 0;
        }

        .li {
          text-align: center;
          margin: 0 0 50px 0;
        }

        .menu-option {
          display: block;
          width: fit-content;
          margin: 0 auto;
          cursor: pointer;
        }
      `;

      div.appendChild(style);
      this.shadow.appendChild(div);
    }

    menuInteraction() {
      const active = state.getState().token;

      const userInfo = this.shadowRoot.querySelector(".user-info");

      if (active) {
        userInfo.classList.add("active");
      }
      const menuButton = this.shadowRoot
        .querySelector(".menu")
        .shadowRoot.querySelector(".menu-container");

      const menuOptions = this.shadowRoot.querySelector(".open-menu");

      const menuContainer = this.shadowRoot.querySelector(".menu-container");

      const lineOne = this.shadowRoot
        .querySelector(".menu")
        .shadowRoot.querySelector(".one");

      const lineTwo = this.shadowRoot
        .querySelector(".menu")
        .shadowRoot.querySelector(".two");

      menuButton.addEventListener("click", () => {
        if (
          !menuOptions.className.includes("abierto") &&
          !menuOptions.className.includes("cerrado")
        ) {
          menuContainer.classList.add("abierto");
          lineOne.classList.add("open");
          lineTwo.classList.add("open");
          return menuOptions.classList.add("abierto");
        }
        if (menuOptions.className.includes("abierto")) {
          menuOptions.classList.remove("abierto");
          menuOptions.classList.add("cerrado");
          menuContainer.classList.remove("abierto");
          lineOne.classList.remove("open");
          lineTwo.classList.remove("open");
          return menuContainer.classList.add("cerrado");
        }
        if (menuOptions.className.includes("cerrado")) {
          menuOptions.classList.remove("cerrado");
          menuOptions.classList.add("abierto");
          menuContainer.classList.add("abierto");
          lineOne.classList.add("open");
          lineTwo.classList.add("open");
          return menuContainer.classList.remove("cerrado");
        }
      });
    }
    sessionInformation() {
      const account = state.getAccount();
      const activeSession = state.getToken();

      let email;

      if (activeSession == false) {
        return (email = "");
      }
      if (activeSession !== false) {
        return (email = account);
      }
    }
  }
  customElements.define("c-header", Header);
}
