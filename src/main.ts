import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.ts";
import "./assets/main.css";
import "vue-awesome-paginate/dist/style.css";
import { createPinia } from "pinia";
import VueAwesomePaginate from "vue-awesome-paginate";

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(VueAwesomePaginate).mount("#app");
