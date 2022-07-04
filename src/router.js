import { createRouter, createWebHistory } from "vue-router";

import HousesList from "./pages/HousesList.vue";
import HouseDetails from "./pages/HouseDetails.vue";
import TheAbout from "./pages/TheAbout.vue";
import CreateListing from "./pages/CreateListing.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/houses" },
    { path: "/houses", component: HousesList },
    { path: "/houses/:houseId", component: HouseDetails, props: true },
    { path: "/houses/:houseId/edit", component: CreateListing, props: true },
    { path: "/houses/create", component: CreateListing },
    { path: "/about", component: TheAbout },
    { path: "/:catchAll(.*)", redirect: "/houses" },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
