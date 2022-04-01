// const API_BASE_URL = "http://localhost:3009";
const API_BASE_URL = "";

const state = {
  data: {
    email: "",
    token: "",
    path: "",
    petDescription: "",
    loc_lat: "",
    loc_lng: "",
    imgUrl: "",
    pet: {
      loc_lat: "",
      loc_lng: "",
    },
    petZone: "",
    editPetId: "",
  },
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  setEmail(email: string) {
    const lastState = this.getState();
    lastState.email = email;
    state.setState(lastState);
  },
  setToken(token) {
    const lastState = this.getState();
    lastState.token = token;
    state.setState(lastState);
    localStorage.setItem("token", lastState.token.toString());
    localStorage.setItem("account", lastState.email.toString());
  },
  setPath(path) {
    const lastState = this.getState();
    lastState.path = path;
    state.setState(lastState);
  },
  setLocation(location) {
    const lastState = state.getState();
    lastState.loc_lat = location.loc_lat;
    lastState.loc_lng = location.loc_lng;
    state.setState(lastState);
  },
  setUrlImg(url) {
    const lastState = this.getState();
    lastState.imgUrl = url;
    state.setState(lastState);
  },
  setPetLocation(lat, lng) {
    const lastState = state.getState();
    lastState.pet.loc_lat = lat;
    lastState.pet.loc_lng = lng;
    state.setState(lastState);
  },
  emailCheck(email: string) {
    const checkResponse = fetch(API_BASE_URL + "/email-check", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    return checkResponse;
  },
  createUser(userData) {
    const email = this.getState().email;

    const newUser = fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: userData.name,
        lastName: userData.lastName,
        password: userData.password,
        password1: userData.password1,
      }),
    });

    return newUser;
  },
  restorePass(userEmail) {
    const restorePass = fetch(API_BASE_URL + "/pass", {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userEmail: userEmail }),
    });

    const restorePassResponse = restorePass
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });

    const response = restorePassResponse.then((data) => {
      if (data.passRestoreRes == true) {
        return true;
      } else {
        return false;
      }
    });
    return response;
  },
  updateUserInfo(userData) {
    let userDataToUpdate = {} as any;

    const email = this.getState().email;

    if (userData) {
      userDataToUpdate.email = email;
    }
    if (userData.name) {
      userDataToUpdate.name = userData.name;
    }
    if (userData.lastName) {
      userDataToUpdate.lastName = userData.lastName;
    }
    if (userData.password) {
      userDataToUpdate.password = userData.password;
    }
    if (userData.password1) {
      userDataToUpdate.password1 = userData.password1;
    }

    const authorization = `beaarer ${state.getState().token}`;

    const updateUserInfo = fetch(API_BASE_URL + "/user", {
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(userDataToUpdate),
    }).then((res) => {
      return res.json();
    });

    return updateUserInfo;
  },
  authToken(userData) {
    const authToken = fetch(API_BASE_URL + "/auth/token", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    return authToken;
  },
  userInfo() {
    const token = state.getToken();
    if (token) {
      const authorization = `bearer ${token}`;

      const userInfo = fetch(API_BASE_URL + "/me", {
        headers: {
          "content-type": "application/json",
          Authorization: authorization,
        },
      }).then((res) => {
        return res.json();
      });

      return userInfo;
    }
  },
  logout() {
    const lastState = this.getState();
    lastState.email = "";
    lastState.token = "";
    lastState.path = "";
    state.setState(lastState);

    localStorage.setItem("token", lastState.token);
  },
  getToken() {
    const localToken = localStorage.getItem("token");

    if (localToken == null) {
      return false;
    }
    if (localToken) {
      return localToken;
    }

    const lastState = state.getState();

    if (lastState.token) {
      return lastState.token;
    } else {
      return false;
    }
  },
  getAccount() {
    const account = localStorage.getItem("account");
    return account;
  },
  setPetInfo(petInfo) {
    const lastState = state.getState();

    lastState.petName = petInfo.petName;
    lastState.petDescription = petInfo.petDescription;
    lastState.status = "lost";
    lastState.pet.loc_lat = lastState.pet.loc_lat;
    lastState.pet.loc_lng = lastState.pet.loc_lng;
    lastState.petZone = lastState.petZone;
    state.setState(lastState);
  },
  resetPetState() {
    const lastState = this.getState();
    (lastState.petDescription = ""),
      (lastState.imgUrl = ""),
      (lastState.pet.loc_lat = ""),
      (lastState.pet.loc_lng = ""),
      (lastState.petZone = "");
    lastState.status = "";
    lastState.petName = "";
    state.setState(lastState);
  },
  setPetZone(petZone) {
    const lastState = this.getState();
    lastState.petZone = petZone;

    state.setState(lastState);
  },
  setEditPetId(id) {
    const lastState = this.getState();
    lastState.editPetId = id;
    state.setState(lastState);
  },
  resetEditPetId() {
    const lastState = this.getState();
    lastState.editPetId = "";
    state.setState(lastState);
  },
  createPet() {
    const token = state.getToken();
    const authorization = `bearer ${token}`;

    const lastState = this.getState();

    const petInfo = {
      petName: lastState.petName,
      petDescription: lastState.petDescription,
      imgUrl: lastState.imgUrl,
      status: lastState.status,
      loc_lat: lastState.pet.loc_lat,
      loc_lng: lastState.pet.loc_lng,
      petZone: lastState.petZone,
      deleted: false,
    };

    const serverResponse = fetch(API_BASE_URL + "/pet", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(petInfo),
    });
    return serverResponse;
  },
  updatePetInfo() {
    const lastState = state.getState();
    const petId = lastState.editPetId;
    const petInfo = {
      name: lastState.petName,
      description: lastState.petDescription,
      imgUrl: lastState.imgUrl,
      status: lastState.status,
      loc_lat: lastState.pet.loc_lat,
      loc_lng: lastState.pet.loc_lng,
      petZone: lastState.petZone,
      petId: petId,
    };
    const authorization = `beaarer ${state.getState().token}`;

    const updateUserInfo = fetch(API_BASE_URL + "/pet", {
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(petInfo),
    });

    return updateUserInfo;
  },
  getMyPets() {
    const token = state.getToken();
    if (token) {
      const authorization = `bearer ${token}`;
      const userPets = fetch(API_BASE_URL + "/my-pets", {
        headers: {
          "content-type": "application/json",
          Authorization: authorization,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return data;
        });

      return userPets;
    }
  },
  getPetsNearBy() {
    const lastState = this.getState();
    const lat = lastState.loc_lat;
    const lng = lastState.loc_lng;

    const pets = fetch(
      API_BASE_URL + "/pets-near-location?lat=" + lat + "&lng=" + lng,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => {
      return res.json();
    });

    return pets;
  },
  reportAsFound(petInfo) {
    delete petInfo.userId;
    delete petInfo.updatedAt;
    delete petInfo.createdAt;
    petInfo.status = "found";

    const token = state.getToken();
    const authorization = `bearer ${token}`;

    const reportAsFound = fetch(API_BASE_URL + "/pet/found", {
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(petInfo),
    });

    const reportAsFoundResponse = reportAsFound
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        return response;
      });

    return reportAsFoundResponse;
  },
  unpublishPet(petInfo) {
    delete petInfo.userId;
    delete petInfo.updatedAt;
    delete petInfo.createdAt;
    petInfo.deleted = "true";

    const token = state.getToken();
    const authorization = `bearer ${token}`;

    const unpublishPet = fetch(API_BASE_URL + "/pet/unpublish", {
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(petInfo),
    });

    const unpublishPetResponse = unpublishPet
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
    return unpublishPetResponse;
  },
  publishAgainPet(petInfo) {
    delete petInfo.userId;
    delete petInfo.updatedAt;
    delete petInfo.createdAt;
    petInfo.status = "lost";

    const token = state.getToken();
    const authorization = `bearer ${token}`;

    const publishAgainPet = fetch(API_BASE_URL + "/pet/publish-again", {
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(petInfo),
    });

    const publishAgainPetResponse = publishAgainPet
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
    return publishAgainPetResponse;
  },
  sendReport(reportInfo) {
    const createReport = fetch(API_BASE_URL + "/create-report", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(reportInfo),
    });

    const createReportResponse = createReport
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
    return createReportResponse;
  },
  sendEmail(information) {
    const sendEmail = fetch(API_BASE_URL + "/send-email", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(information),
    });

    const sendEmailResponse = sendEmail
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });
    return sendEmailResponse;
  },
};

export { state };
