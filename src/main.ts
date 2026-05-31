import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "@mdi/font/css/materialdesignicons.css";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import App from "./App.vue";
import enMessages from "./locales/en.json";
import { router } from "./router";

const i18n = createI18n({
  fallbackLocale: "en",
  messages: {
    en: enMessages,
  },
});

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App).use(router).use(i18n).use(vuetify);

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("media-");

app.mount("#app");
