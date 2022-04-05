import { initLogo } from "./components/logo";
import { initHeader } from "./components/header";
import { initMenu } from "./components/menu";
import { initText } from "./components/text";
import { initButton } from "./components/button";
import { initLink } from "./components/link";
import { initInputField } from "./components/forms/input-field";
import { initTextAreaField } from "./components/forms/text-area-field";
import { initPetCard } from "./components/petCard";
import { initReportForm } from "./components/forms/report-info";

import "./pages/home";
import "./pages/login-signup";
import "./pages/pass";
import "./pages/user-data";
import "./pages/nearbyme";
import "./pages/report-pet";
import "./pages/my-reports";
import "./router";

import { state } from "./state";
import { Router } from "./router";

function main() {
  initLogo();
  initHeader();
  initMenu();
  initText();
  initButton();
  initLink();
  initInputField();
  initTextAreaField();
  initPetCard();
  initReportForm();
}

main();

export function menuInteraction(page) {
  // BOTONES
  const logoutButton = page
    .querySelector(".header-component")
    .shadowRoot.querySelector(".logout")
    .shadowRoot.querySelector(".text");

  const myDataButton = page
    .querySelector(".header-component")
    .shadowRoot.querySelector(".data")
    .shadowRoot.querySelector(".text");

  const myReportedPetsButton = page
    .querySelector(".header-component")
    .shadowRoot.querySelector(".my-reports")
    .shadowRoot.querySelector(".text");

  const reportPetButton = page
    .querySelector(".header-component")
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
