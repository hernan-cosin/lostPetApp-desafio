import { Router } from "../../router";
import { state } from "../../state";
import { menuInteraction } from "../../index";

class UserData extends HTMLElement {
  shadowRoot: ShadowRoot;
  connectedCallback() {
    if (state.getToken()) {
      state.userInfo().then((data) => {
        if (data.name && data.lastName) {
          this.render();
          this.formHandler(data.name, data.lastName);
          menuInteraction(this);
        }
      });
    } else {
      this.render();
      this.formHandler();
      menuInteraction(this);
    }
  }

  render() {
    this.innerHTML = `
            <header class="header">
                <c-header class="header-component"></c-header>
            </header>
              <section class="main">
                <div class="content">
                  <c-text size="40" weight="700" class="title">Datos</c-text>
                  <form class="form">
                    <input-field type="text" label="Nombre" class="input-field name"></input-field>
                    <input-field type="text" label="Apellido" class="input-field lastName"></input-field>
                    <input-field type="password" label="Contraseña" class="input-field pass"></input-field>
                    <input-field type="password" label="Repetir contraseña" class="input-field pass1"></input-field>
                    <c-button color="yellow" class="button">Guardar</c-button>
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
          min-height: 100vh;
          height: auto;
          padding: 110px 20px 20px 20px;
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

  formHandler(name?, lastName?) {
    const nameInput = this.querySelector(".name").shadowRoot.querySelector(
      ".input"
    ) as any;

    const lastNameInput = this.querySelector(
      ".lastName"
    ).shadowRoot.querySelector(".input") as any;

    const passInput = this.querySelector(".pass").shadowRoot.querySelector(
      ".input"
    ) as any;

    const pass1Input = this.querySelector(".pass1").shadowRoot.querySelector(
      ".input"
    ) as any;

    const nextButton =
      this.querySelector(".button").shadowRoot.querySelector(".button");

    if (name && lastName) {
      nameInput.value = name;
      lastNameInput.value = lastName;
    }

    nextButton.addEventListener("click", (e) => {
      if (!nameInput && !lastNameInput) {
        return;
      }

      if (!name == true && !lastName == true) {
        const userData = {
          name: nameInput.value,
          lastName: lastNameInput.value,
          password: passInput.value,
          password1: pass1Input.value,
        };
        const createUser = state.createUser(userData);
        return createUser
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.response == true) {
              Router.go("/signup-in");
            }
          });
      }
      if (
        (passInput.value && pass1Input.value) ||
        (nameInput.value && lastNameInput.value)
      ) {
        const userData = {
          name: nameInput.value,
          lastName: lastNameInput.value,
          password: passInput.value,
          password1: pass1Input.value,
        };

        const updateUserResponse = state.updateUserInfo(userData);
        return updateUserResponse.then((data) => {
          if (data.updatedUserAndAuth == true) {
            Router.go("/");
          }
        });
      }
      if (
        (name && name !== nameInput.value) ||
        (lastName && lastName !== lastNameInput.value)
      ) {
        const userData = {
          name: nameInput.value,
          lastName: lastNameInput.value,
          password: passInput.value,
          password1: pass1Input.value,
        };

        const updateUserResponse = state.updateUserInfo(userData);
        return updateUserResponse.then((data) => {
          if (data.userUpdate == true) {
            Router.go("/");
          }
        });
      }
    });
  }
}
customElements.define("user-data-page", UserData);
