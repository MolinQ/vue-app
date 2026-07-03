<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import router, { routes } from "@/router/router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const open = ref(false);

const navRoutes = computed(() =>
  routes.filter((route) => {
    if (route.hideFromNav) return false;
    if (route.meta?.requiresAuth && !authStore.isAuthenticated) return false;
    return true;
  }),
);

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<template>
  <nav class="sticky top-0 z-50 shrink-0 bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4">
      <div class="h-16 flex items-center justify-between">
        <RouterLink to="/" class="font-bold text-xl text-blue-600">
          Themovie
        </RouterLink>

        <div class="hidden md:flex items-center gap-6">
          <RouterLink
            v-for="route in navRoutes"
            :key="route.name"
            :to="route.path"
            class="text-gray-600 hover:text-blue-600 transition capitalize"
          >
            {{ route.name }}
          </RouterLink>

          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </RouterLink>

          <button
            v-else
            @click="logout"
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <button class="md:hidden text-2xl" @click="open = !open">☰</button>
      </div>

      <div v-if="open" class="md:hidden pb-4 flex flex-col gap-3">
        <RouterLink
          v-for="route in navRoutes"
          :key="route.name"
          :to="route.path"
          class="text-gray-600 hover:text-blue-600 capitalize"
        >
          {{ route.name }}
        </RouterLink>

        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="w-full py-2 rounded-lg bg-blue-600 text-white text-center"
        >
          Login
        </RouterLink>

        <button
          v-else
          class="w-full py-2 rounded-lg bg-red-500 text-white"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>
