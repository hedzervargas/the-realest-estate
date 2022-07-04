import { readHouses } from "@/firebase";
import { watch } from "vue";
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      houses: [],
      onMobile: null,
    };
  },
  mutations: {
    setHouses(state, payload) {
      state.houses = payload;
    },
    toMobile(state, payload) {
      state.onMobile = payload;
    },
  },
  actions: {
    setHouses(context) {
      const houses = readHouses();
      context.commit("setHouses", houses);

      // update state everytime when houses change
      watch(houses, () => {
        context.commit("setHouses", houses);
      });
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
    onMobile(state) {
      return state.onMobile;
    },
    houses(state) {
      return state.houses;
    },
    house(state, id) {
      return () => state.houses.find((house) => house.id === id);
    },
  },
});

export default store;
