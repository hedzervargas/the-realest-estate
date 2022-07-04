import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      apiLink: "https://api.intern.d-tt.nl/api/houses",
      headers: new Headers({
        "X-Api-Key": "3kjG1MCwSDHo5xW0XlQrPdt8LmhKY4-a",
      }),
      houses: [],
      onMobile: null,
      addedHouseId: "",
    };
  },
  mutations: {
    setHouses(state, payload) {
      state.houses = payload;
    },
    deleteHouse(state, payload) {
      state.houses.splice(payload, 1);
    },
    toMobile(state, payload) {
      state.onMobile = payload;
    },
    setAddedHouseId(state, payload) {
      state.addedHouseId = payload;
    },
  },
  actions: {
    async setHouses(context) {
      const apiLink = context.getters.apiLink;
      const headers = context.getters.headers;

      const response = await fetch(apiLink, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch!");
      }

      const responseData = await response.json();

      context.commit("setHouses", responseData);
    },
    async addHouse(context, payload) {
      const formData = toFormData(payload);

      // posting all info, except picture
      const apiLink = context.getters.apiLink;
      const headers = context.getters.headers;

      const response = await fetch(apiLink, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch!");
      }

      const responseData = await response.json();

      // adding picture & updating state in addHousePicture
      const picture = {
        value: payload.picture,
        houseId: responseData.id,
      };
      context.dispatch("addHousePicture", picture);

      // setting id in state
      context.commit("setAddedHouseId", responseData.id);
    },
    async addHousePicture(context, payload) {
      // appending picture to formdata
      const formData = new FormData();
      formData.append("image", payload.value, payload.value.name);

      // posting picture
      const apiLink =
        context.getters.apiLink + "/" + payload.houseId + "/upload";
      const headers = context.getters.headers;

      const response = await fetch(apiLink, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch!");
      }

      // updating state
      context.dispatch("setHouses");
    },
    async deleteHouse(context, payload) {
      const apiLink = context.getters.apiLink;
      const headers = context.getters.headers;

      const response = await fetch(apiLink + "/" + payload, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch!");
      }

      // update state ...
      const houses = context.getters.houses;
      const houseIndex = houses.findIndex((house) => house.id === payload);
      context.commit("deleteHouse", houseIndex);
    },
    async editHouse(context, payload) {
      const houseIdUrl = payload.houseId;

      const formData = toFormData(payload);

      // posting all info, except picture
      const apiLink = context.getters.apiLink;
      const headers = context.getters.headers;

      const response = await fetch(apiLink + "/" + houseIdUrl, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch!");
      }

      // adding picture & updating state in addHousePicture
      const picture = {
        value: payload.picture,
        houseId: houseIdUrl,
      };
      if (picture.value instanceof File) {
        context.dispatch("addHousePicture", picture);
      } else {
        // updating state
        context.dispatch("setHouses");
      }
    },
    toMobile(context) {
      let onMobile = null;
      const checkResize = () => {
        window.innerWidth >= 1000 ? (onMobile = false) : (onMobile = true);
        context.commit("toMobile", onMobile);
      };
      window.addEventListener("resize", checkResize);
      checkResize();
    },
  },
  getters: {
    apiLink(state) {
      return state.apiLink;
    },
    headers(state) {
      return state.headers;
    },
    houses(state) {
      return state.houses;
    },
    house(state) {
      return (houseId) => {
        return state.houses.find((house) => house.id == houseId);
      };
    },
    addedHouseId(state) {
      return state.addedHouseId;
    },
    onMobile(state) {
      return state.onMobile;
    },
  },
});

function toFormData(payload) {
  // converting price and size to numbers
  payload.price = Number(payload.price.replace(/[^0-9,-]+/g, ""));
  if (payload.size.includes("m2")) payload.size = payload.size.slice(0, -2);

  // appending all info to formdata, except picture & houseId
  const formData = new FormData();
  for (const key in payload) {
    if (key !== "picture" && key !== "houseId") {
      formData.append(key, payload[key]);
    }
  }
  return formData;
}

export default store;
