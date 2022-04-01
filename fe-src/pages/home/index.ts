import { Router } from "../../router";
import { state } from "../../state";

class HomePage extends HTMLElement {
  shadowRoot: ShadowRoot;
  connectedCallback() {
    this.render();
    this.menuInteraction();
    this.userLocation();
  }

  render() {
    this.innerHTML = `
            <header class="header">
                <c-header class="header-component"></c-header>
            </header>
              <section class="main">
                <div class="content">
                  <c-text size="40" weight="700" capitalize="false" class="title">Mascotas perdidas cerca tuyo</c-text>
                  <c-text size="16" weight="500" capitalize="true" class="text">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.
                  </c-text>
                  <c-button color="yellow" class="button location">Dar mi ubicación</c-button>
                </div>
              </section>
        `;

    const style = document.createElement("style");

    style.innerHTML = `
        .header {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
        }

        .header-component {
            display: block;
        }

        .main {
          background: var(--principal);
          min-height: 100vh;
          padding: 110px 20px 20px 20px;
          height: auto;
        }

        .content {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .title {
          max-width: 350px;
          margin: 0 auto 50px auto;
          display: block;
        }

        .text {
          max-width: 350px;
          margin: 0 auto 20px auto;
          display: block;
        }

        .button {
          display: block;
          text-align: center;
        }
        `;

    this.appendChild(style);
  }
  menuInteraction() {
    // BOTONES
    const logoutButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".logout")
      .shadowRoot.querySelector(".text");

    const myDataButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".data")
      .shadowRoot.querySelector(".text");

    const myReportedPetsButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".my-reports")
      .shadowRoot.querySelector(".text");

    const reportPetButton = this.querySelector(".header-component")
      .shadowRoot.querySelector(".report")
      .shadowRoot.querySelector(".text");

    // //LISTENERS
    // LOGOUT
    logoutButton.addEventListener("click", () => {
      state.logout();
      Router.go("/");
    });

    // MENUBUTTONS
    const menuOptionButton = [
      myDataButton,
      myReportedPetsButton,
      reportPetButton,
    ];

    menuOptionButton.forEach((buttonEl) => {
      buttonEl.addEventListener("click", () => {
        const token = state.getToken();

        if (!token) {
          // si no hay token setea el path en el state para ir luego de ingresar y recibir token.
          if (buttonEl.innerHTML.includes("datos")) {
            state.setPath("/user-data");
          }
          if (buttonEl.innerHTML.includes("mascota")) {
            state.setPath("/report-pet");
          }
          if (buttonEl.innerHTML.includes("mascotas")) {
            state.setPath("/my-reports");
          }
          return Router.go("/signup-in");
        }
        // si hay token setea el path en el state y el router redirige hacia el botón seleccionado
        if (buttonEl.innerHTML.includes("datos")) {
          state.setPath("/user-data");
        }
        if (buttonEl.innerHTML.includes("mascota")) {
          state.setPath("/report-pet");
        }
        if (buttonEl.innerHTML.includes("mascotas")) {
          state.setPath("/my-reports");
        }
        Router.go(state.getState().path);
      });
    });
  }
  userLocation() {
    const buttonEl =
      this.querySelector(".location").shadowRoot.querySelector(".button");

    buttonEl.addEventListener("click", () => {
      this.getlocation();
    });
  }

  // solicitar acceso a la ubicación actual del usuario
  getlocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition);
    }
  }

  // callback para recibir la posición del usuario
  // setearla en el state y redirigirse a pagina de mascotas cercanas
  setPosition(position) {
    const location = {
      loc_lat: position.coords.latitude,
      loc_lng: position.coords.longitude,
    };
    state.setLocation(location);
    Router.go("/near-byme");
  }
}
customElements.define("home-page", HomePage);
