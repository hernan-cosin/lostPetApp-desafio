import { Router } from "@vaadin/router";

const outlet = document.querySelector(".root");
const router = new Router(outlet);

router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/signup-in", component: "signup-page" },
  { path: "/user-data", component: "user-data-page" },
  { path: "/login", component: "pass-page" },
  { path: "/near-byme", component: "nearbyme-page" },
  { path: "/report-pet", component: "report-pet-page" },
  { path: "/my-reports", component: "my-reports-page" },
]);

export { Router };
