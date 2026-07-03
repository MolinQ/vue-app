<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "@/components/common/Navigation.vue";

const route = useRoute();

const showNavbar = computed(() => {
  return route.path !== "/login" && route.path !== "/register";
});
</script>

<template>
  <div class="app-layout">
    <NavBar v-if="showNavbar" />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
