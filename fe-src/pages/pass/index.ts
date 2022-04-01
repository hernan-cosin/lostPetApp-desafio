import { Router } from "../../router";
import { state } from "../../state";

class PassPage extends HTMLElement {
  shadowRoot: ShadowRoot;
  connectedCallback() {
    this.render();

    this.menuinteraction();
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
                    <input-field type="password" label="Contraseña" class="input-field pass"></input-field>
                    <div class="message"></div>
                    <div class="message restore"></div>
                    <c-link class="password-forget" size="14" weight="500" capitalize="true">Olvide mi contraseña</c-link>
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
        
        .message {
          text-align: center;
          font-family: Poppins, sans-serif;
          margin: 5px 0 0 0;
        }

        .button {
          display: block;
          text-align: center;
          margin: 20px 0 0 0;
        }

        .password-forget {
          display: block;
          width: fit-content;
          margin: 10px auto 0 auto;
        }
        `;

    this.appendChild(style);
  }

  menuinteraction() {
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
    // ELEMENTS
    const input = this.querySelector(".input-field").shadowRoot.querySelector(
      ".input"
    ) as any;

    const message = this.querySelector(".message");

    const messageRestore = this.querySelector(".restore");

    const nextButton =
      this.querySelector(".button").shadowRoot.querySelector(".button");

    const forgotPasswordLink =
      this.querySelector(".password-forget").shadowRoot.querySelector(".text");

    // LISTENERS
    nextButton.addEventListener("click", (e) => {
      if (input.value.length == 0) {
        return;
      } else {
        const lastState = state.getState();

        const userData = {
          email: lastState.email,
          password: input.value,
        };
        state
          .authToken(userData)
          .then((res) => {
            return res.json();
          })
          .then((resp) => {
            if (resp.verified == false) {
              input.style.border = "3px solid red";
              message.innerHTML = `Contraseña incorrecta`;
            } else {
              state.setToken(resp.token);
              const path = state.getState().path;
              Router.go(path);
            }
          });
      }
    });

    forgotPasswordLink.addEventListener("click", () => {
      const email = state.getState().email;

      const newPassResponse = state.restorePass(email);

      newPassResponse.then((data) => {
        if (data) {
          messageRestore.innerHTML = `Hemos enviado una contraseña provisoria a tu email.`;
        }
      });
    });
  }
}
customElements.define("pass-page", PassPage);
