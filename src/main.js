import { createApp } from "vue";
import App from "./App.vue";

import i18n from "./locales/i18n";

import router from "./router";

import { connect } from "contractUtils/connect.js";

import UnitButton from "components/ui/UnitButton.vue";

connect();

const app = createApp(App);
app.component("UnitButton", UnitButton).use(router).use(i18n).mount("#app");
