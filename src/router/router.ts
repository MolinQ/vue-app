import { useAuthStore } from "@/stores/authStore";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Profile from "@/pages/UserProfile.vue";
import Home from "@/pages/Home.vue";
import Search from "@/pages/SearchMovie.vue";
import Favorites from "@/pages/Favorites.vue";
import Movie from "@/pages/Movie.vue";
import { createRouter, createWebHistory } from "vue-router";
const guestRoutes = ["/login", "/register"];

export const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    hideFromNav: true,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
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
    path: "/favorites",
    name: "favorites",
    component: Favorites,
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

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    await authStore.init();
  }

  const isGuestRoute = guestRoutes.includes(to.path);

  if (!authStore.isAuthenticated && !isGuestRoute) {
    return "/login";
  }

  if (authStore.isAuthenticated && isGuestRoute) {
    return "/";
  }

  return true;
});

export default router;
