import { createApp } from "vue";

import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";
import BaseDialog from "./components/BaseDialog.vue";
import BaseSpinner from "./components/BaseSpinner.vue";

const app = createApp(App);

app.use(router);
app.use(store);

app.component("base-dialog", BaseDialog);
app.component("base-spinner", BaseSpinner);

app.mount("#app");
