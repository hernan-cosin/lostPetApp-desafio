import { Router } from "../../router";
import { Dropzone } from "dropzone";
import { state } from "../../state";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const emptyImg = require("url:../../media/empty-img.png");
const mapboxToken = process.env.MAPBOX_TOKEN;

class ReportPetPage extends HTMLElement {
  shadowRoot: ShadowRoot;
  connectedCallback() {
    const access = state.getToken() ? true : false;

    if (access) {
      const petIdLength = state.getState().editPetId.length;

      // la misma pagina para editar una mascota perdida sirve para crearla
      // si no hay petId en el state se renderiza para crearla
      if (petIdLength == 0) {
        this.render({ edit: false });
        this.menuInteraction();
        this.formHandler();
        return this.displayMap();
      }
      // si hay un petId en el state se renderiza con los datos de la mascota
      if (petIdLength > 0) {
        // obtiene las mascotas del usuario
        const pets = state.getMyPets();

        // filtra la mascota con el petId del state para renderizar con su información
        pets.then((pets) => {
          const petInfo = pets.pets.find(
            (pet) => pet.id == state.getState().editPetId
          );

          const status = petInfo.status;
          this.render({ edit: true, status: status });
          this.menuInteraction();
          this.formHandler(petInfo);
          return this.displayMap([petInfo.loc_lng, petInfo.loc_lat]);
        });
      }
    } else {
      Router.go("/signup-in");
    }
  }

  render(opt?) {
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
          height: auto;
          padding: 110px 20px 20px 20px;
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

        .name-input {
          display: block;
        }
        
        .text-area {
          display: block;
        }

        .img-container {
          display: block;
          margin: 10px auto;
          max-width: 350px;
          width: 100%;
          border-radius: 4px;
          border: solid 2px black;
        }

        .img-button{
          margin: 0 0 10px 0;
        }

        .geocoder {
          margin: 0 auto;
        } 
          
        .mapboxgl-ctrl-geocoder  {
          position: relative;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          max-width: 350px;
          width: 100%;
          box-sizing: border-box;
          border: 2px solid;
          height: 50px;
          line-height: 50px;
          margin: 0 auto;
        }

        @media screen and (min-width: 640px) {
          .mapboxgl-ctrl-geocoder--input {
            height: 44px;
            padding: 6px 35px;
          }
        }

        .mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-search {
          top: 13px;
        }

        @media screen and (min-width: 640px){
          .mapboxgl-ctrl-geocoder--icon-search {
            top: 13px;
          }
        }

        #map {
          max-width: 350px;
          width: 100%;
          height: 290px;
          border: 2px solid;
          border-radius: 4px;
          margin: 20px auto;
        }

        .map-input {
          
        }

        .message {
          display: block;
          font-family: sans-serif;
          color: red;
          width: fit-content;
          max-width: 350px;
          margin: 0 auto 10px auto;
        }

        .link {
          display: block;
          text-align: center;
        }

        .report-pet{
          margin: 0 0 10px 0;
        }

        .cancel{
          margin: 0 0 10px 0;
        }
        
        .button {
          display: block;
          text-align: center;
          margin: 0 0 10px 0 ;
        }
        `;

    if (opt.edit == false) {
      this.innerHTML = `
              <header class="header">
                  <c-header class="header-component"></c-header>
              </header>
                <section class="main">
                  <div class="content">
                    <c-text size="40" weight="700" capitalize="false" class="title">Reportar mascota perdida</c-text>
                    <form class="form">
                      <input-field label="Nombre" type="text" class="name-input"></input-field>
                      <div class="message message-name"></div>
                      <text-area-field label="Descripción" type="text-area" class="description-input"></text-area-field>
                      <img src="${emptyImg}" class="img-container">
                      <div class="message message-img"></div>
                      <c-button color="yellow" class="button img-button">Agregar/ Modificar foto</c-button>
                      <div id="geocoder" class="geocoder"></div>
                      <div id="map"></div>
                      <div class="remove-marker-container"></div>
                      <div class="message message-marker"></div>
                      <c-text size="16" weight="500" capitalize="true" class="text">Clickea en el mapa para agregar un marcador como punto de referencia para reportar a tu mascota.</c-text> 
                      <c-text size="16" weight="500" capitalize="true" class="text">Puedes guiarte con el buscador de ubicaciones arriba del mapa.</c-text> 
                      <div class="message message-location"></div>
                      <div class="message message-report"></div>
                      <c-button color="yellow" class="button report-pet">Reportar como perdido</c-button>
                      <c-button class="button cancel">Cancelar</c-button>
                    </form>
                  </div>
                </section>
          `;
      return this.appendChild(style);
    }
    if (opt.edit == true) {
      this.innerHTML = `
            <header class="header">
                <c-header class="header-component"></c-header>
            </header>
              <section class="main">
                <div class="content">
                  <c-text size="40" weight="700" capitalize="false" class="title">Editar mascota perdida</c-text>
                  <form class="form">
                    <input-field label="Nombre" type="text" class="name-input"></input-field>
                    <div class="message message-name"></div>
                    <text-area-field label="Descripción" type="text-area" class="description-input"></text-area-field>
                    <img src="${emptyImg}" class="img-container">
                    <div class="message message-img"></div>
                    <c-button color="yellow" class="button img-button">Agregar/ Modificar foto</c-button>
                    <div id="geocoder" class="geocoder"></div>
                    <div id="map"></div>
                    <div class="remove-marker-container"></div>
                    <div class="message message-marker"></div>
                    <c-text size="16" weight="500" capitalize="true" class="text">Clickea en el mapa para agregar un marcador como punto de referencia para reportar a tu mascota.</c-text> 
                    <c-text size="16" weight="500" capitalize="true" class="text">Puedes guiarte con el buscador de ubicaciones arriba del mapa.</c-text> 
                    <div class="message message-location"></div>
                    <div class="message message-report"></div>
                    <c-button color="yellow" class="button save-pet">Guardar</c-button>
                    <c-button class="button report-found">Reportar como encontrado</c-button>
                    ${
                      opt.status == "lost"
                        ? "<c-link class='link unpublish'>Despublicar<c-link>"
                        : "<c-link class='link publish'>Volver a publicar<c-link>"
                    }
                    </form>
                </div>
              </section>
        `;
      return this.appendChild(style);
    }
  }
  menuInteraction() {
    // BUTTONS
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

    // LISTENERS
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
  formHandler(petInfo?) {
    const form = this.querySelector(".form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // ELEMENTS
    const nameInputEl = this.querySelector(
      ".name-input"
    ).shadowRoot.querySelector(".input") as any;

    const textareaEl = this.querySelector(
      ".description-input"
    ).shadowRoot.querySelector(".text-area") as any;

    const imgContainer = this.querySelector(".img-container") as any;

    const imgButton =
      this.querySelector(".img-button").shadowRoot.querySelector(".button");

    // MESSAGE CONTAINER ELEMENTS
    const messageName = this.querySelector(".message-name");
    const messageImg = this.querySelector(".message-img");
    const messageLocation = this.querySelector(".message-location");
    const messageReport = this.querySelector(".message-report");

    // dropzone script
    const myDropzone = new Dropzone(imgButton, {
      url: "/falsa",
      autoProcessQueue: false,
      disablePreviews: true,
    });

    myDropzone.on("thumbnail", function (file) {
      // usando este evento pueden acceder al dataURL directamente
      imgContainer.src = file.dataURL;
      state.setUrlImg(file.dataURL);
    });

    if (petInfo == undefined) {
      const reportPetButton =
        this.querySelector(".report-pet").shadowRoot.querySelector(".button");

      reportPetButton.addEventListener("click", () => {
        const petInfo = formfieldsCheck();
        state.setPetInfo(petInfo);
        state
          .createPet()
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.response == false) {
              messageReport.innerHTML = `Ya existe una mascota con ese nombre, dirigase a <c-link class="link">mis mascotas reportadas<c-link>`;
              const link = this.querySelector(".link");

              link.addEventListener("click", () => {
                Router.go("/my-reports");
              });
            }
            if (data.response.created == true) {
              state.resetPetState();
              Router.go("/my-reports");
            }
          });
      });
      return;
    }
    if (petInfo) {
      // carga el formulario con los datos de la mascota
      this.structurePetInfo(petInfo, nameInputEl, textareaEl, imgContainer);

      state.setUrlImg(imgContainer.src);

      // ELMENTS
      const savePetButton =
        this.querySelector(".save-pet").shadowRoot.querySelector(".button");

      const reportAsFound =
        this.querySelector(".report-found").shadowRoot.querySelector(".button");

      // LISTENERS
      savePetButton.addEventListener("click", () => {
        const petInfo = formfieldsCheck();
        state.setPetInfo(petInfo);
        const serverResponse = state.updatePetInfo();
        serverResponse
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.updated == true) {
              Router.go("/my-reports");
            }
          });
      });

      reportAsFound.addEventListener("click", () => {
        const reportAsFoundResponse = state.reportAsFound(petInfo);
        reportAsFoundResponse.then((res) => {
          if (res.setFoundPet == true) {
            Router.go("/my-reports");
          }
        });
      });

      if (petInfo.status == "lost") {
        // ELEMENT

        const unpublishLink =
          this.querySelector(".unpublish").shadowRoot.querySelector(".text");

        // LISTENER
        unpublishLink.addEventListener("click", () => {
          const unpublishPetResponse = state.unpublishPet(petInfo);
          unpublishPetResponse.then((res) => {
            if (res.unpublished == true) {
              Router.go("/my-reports");
            }
          });
        });
      }
      if (petInfo.status == "found") {
        // ELEMENT
        const publishLink =
          this.querySelector(".publish").shadowRoot.querySelector(".text");

        // LISTENER
        publishLink.addEventListener("click", () => {
          const publishAgainPetResponse = state.publishAgainPet(petInfo);
          publishAgainPetResponse.then((res) => {
            if (res.publishAgain == true) {
              Router.go("/my-reports");
            }
          });
        });
      }
    }
    function formfieldsCheck() {
      const lastState = state.getState();

      if (nameInputEl.value == "") {
        messageName.innerHTML = `El nombre de tu mascota está incompleto`;
      }
      if (state.getState().imgUrl == "" || imgContainer.src == emptyImg) {
        messageImg.innerHTML = `La foto de tu mascota es obligatoria.`;
      }
      if (lastState.pet.loc_lat == "" || lastState.pet.loc_lng == "") {
        messageLocation.innerHTML = `Falta un marcador para ubicar en tu mascota`;
      }
      if (
        (nameInputEl.value !== "" && state.getState().imgUrl !== "") ||
        (imgContainer.src !== emptyImg && lastState.pet.loc_lat !== "") ||
        lastState.pet.loc_lng !== ""
      ) {
        const petInfo = {
          petName: nameInputEl.value,
          petDescription: textareaEl.value,
        };
        return petInfo;
      }
    }
  }
  initMap() {
    const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    return new mapboxgl.Map({
      container: "map",
      center: [-58.515576, -34.6279927],
      zoom: 10,
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }
  displayMap(petLocation?) {
    let map = this.querySelector("#map") as any;

    map = this.initMap();
    map.addControl(new mapboxgl.NavigationControl());

    // USER LOCATION BUTTON (No funcionan los marcadores cuando un usuario selecciona su ubicación en el mapa)
    // const geolocate = new mapboxgl.GeolocateControl();
    // map.addControl(geolocate);
    // geolocate.on("geolocate", (data) => {
    // console.log(data);
    // console.log(data.target._userLocationDotMarker);

    // console.log("A geolocate event has occurred.", [
    //   data.coords.latitude,
    //   data.coords.longitude,
    // ]);
    // this.setMarker(
    //   map,
    //   [data.coords.longitude, data.coords.latitude],
    //   data.target._userLocationDotMarker
    // );
    // });
    this.setMarker(map, petLocation);
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Ubicación",
      countries: "Ar",
    });
    geocoder.addTo("#geocoder");
    geocoder.on("result", (result) => {
      map.flyTo({
        center: [
          result.result.geometry.coordinates[0],
          result.result.geometry.coordinates[1],
        ],
        essential: true,
        zoom: 14,
      });
    });
  }
  setMarker(map, petLocation?, userLocation?) {
    if (petLocation == undefined) {
      this.mapMarkerListener(map);
    } else {
      const firstMarker = new mapboxgl.Marker();
      firstMarker.setLngLat(petLocation).addTo(map);
      map.flyTo({
        center: [petLocation[0], petLocation[1]],
        essential: true,
        zoom: 14,
      });
      this.addRemoveMarkerButton(firstMarker, map, userLocation);

      this.mapMarkerListener(map);
      state.setPetLocation(petLocation[1], petLocation[0]);
    }
  }
  mapMarkerListener(map) {
    map.on("click", (e) => {
      if (map._markers.length < 1) {
        const marker = new mapboxgl.Marker();
        state.setPetLocation(e.lngLat.lat, e.lngLat.lng);

        marker.setLngLat(e.lngLat).addTo(map);

        const petZone = fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?types=place%2Cpostcode%2Caddress&limit=1&access_token=${mapboxToken}`,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );

        petZone
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            state.setPetZone(data.features[0].place_name);
          });
        return this.addRemoveMarkerButton(marker, map);
      }
      if (map._markers.length == 1) {
        const messageMarker = this.querySelector(".message-marker");

        return (messageMarker.innerHTML = `Debe quitar el marcador actual para seleccionar uno nuevo.`);
      }
      if (map._markers.length > 1) {
        return;
      }
    });
  }
  addRemoveMarkerButton(marker, map, userLocation?) {
    const removeMarkerContainer = this.querySelector(
      ".remove-marker-container"
    );

    const removeMarkerButton = document.createElement("c-button");
    removeMarkerButton.setAttribute("color", "yellow");
    removeMarkerButton.setAttribute("class", "button remove-marker-button");
    removeMarkerButton.textContent = "Quitar marcador";

    removeMarkerButton.addEventListener("click", () => {
      marker.remove();
      // USER LOCATION MARKER REMOVER
      // if (userLocation) {
      //   userLocation.remove();
      // }
      removeMarkerContainer.firstChild.remove();
    });

    removeMarkerContainer.appendChild(removeMarkerButton);
  }
  structurePetInfo(petInfo, name, textArea, img) {
    if (petInfo == undefined) {
      name.value = "";
      textArea.value = "";
      img.src = emptyImg;
    } else {
      name.value = petInfo.name;
      textArea.value = petInfo.description;
      img.src = petInfo.imgUrl;
    }
  }
}
customElements.define("report-pet-page", ReportPetPage);
