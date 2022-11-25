import { createApp } from "vue";
import App from "./App.vue";

import i18n from "./locales/i18n";

import router from "./router";

import UnitButton from "./components/ui/UnitButton.vue";

const app = createApp(App);
app.component("UnitButton", UnitButton).use(router).use(i18n).mount("#app");
