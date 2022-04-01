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
