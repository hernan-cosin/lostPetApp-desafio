import { Router } from "../../router";
import { state } from "../../state";

class LoginSignupPage extends HTMLElement {
  shadowRoot: ShadowRoot;
  connectedCallback() {
    this.render();
    this.menuInteraction();
    this.formHandler();
  }

  render() {
    this.innerHTML = `
            <header class="header">
                <c-header class="header-component"></c-header>
            </header>
              <section class="main">
                <div class="content">
                  <c-text size="40" weight="700" class="title">Ingresar</c-text>
                  <form class="form">
                    <input-field type="email" label="Email" class="input-field"></input-field>
                    <c-button color="yellow" class="button">Siguiente</c-button>
                  </form>
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
          height: 100vh;
          padding: 110px 20px 0 20px;
        }

        .content {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .title {
          display: block;
          text-align: center;
        }

        .form {

        }

        .input-field {
          display: block;
        }

        .button {
          display: block;
          text-align: center;
          margin: 20px 0 0 0;
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
        Router.go("/signup-in");
      });
    });
  }

  formHandler() {
    const input = this.querySelector(".input-field").shadowRoot.querySelector(
      ".input"
    ) as any;

    const nextButton =
      this.querySelector(".button").shadowRoot.querySelector(".button");

    nextButton.addEventListener("click", (e) => {
      if (input.value.length == 0) {
        return;
      } else {
        const response = state.emailCheck(input.value) as any;
        response
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            state.setEmail(input.value);
            if (res.userFound == true) {
              // si encuentra un email en la DB continua a pedir contraseña
              Router.go("/login");
            }
            if (res.userFound == false) {
              // si no encuentra un email en la DB continua a la pagina de datos para completarlos y crear un usuario.
              Router.go("/user-data");
            }
          });
      }
    });
  }
}
customElements.define("signup-page", LoginSignupPage);
