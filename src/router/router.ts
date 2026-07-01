import { localStorageVariables } from "@/constants/storageVariables";
import Login from "@/pages/Login.vue";
import Profile from "@/pages/UserProfile.vue";
import Home from "@/pages/Home.vue";
import Search from "@/pages/SearchMovie.vue";
import Movie from "@/pages/Movie.vue";
import { LocalStorageService } from "@/services/StorageService";
import { createRouter, createWebHistory } from "vue-router";
const storage = new LocalStorageService();

export const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    hideFromNav: true,
  },
  {
    path: "/",
    name: "home",
    component: Home,
    hideFromNav: true,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    hideFromNav: false,
  },
  {
    path: "/search",
    name: "search",
    component: Search,
    hideFromNav: false,
  },
  {
    path: "/movie/:id",
    name: "movie",
    component: Movie,
    hideFromNav: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const store = storage.get(localStorageVariables.KEY);

  if (!store && to.path !== "/login") {
    return "/login";
  }

  return true;
});

export default router;
