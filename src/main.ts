import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.ts";
import "./assets/main.css";
import "vue-awesome-paginate/dist/style.css";
import { createPinia } from "pinia";
import VueAwesomePaginate from "vue-awesome-paginate";
import { useAuthStore } from "./stores/authStore";
import { useFavoritesStore } from "./stores/favoritesStore";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

await authStore.init();
favoritesStore.init();

app.use(router).use(VueAwesomePaginate).mount("#app");
