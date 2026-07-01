<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "@/components/common/Navigation.vue";

const route = useRoute();

const showNavbar = computed(() => {
  return route.path !== "/login";
});
</script>

<template>
  <NavBar v-if="showNavbar" />
  <RouterView />
</template>

<style scoped></style>
