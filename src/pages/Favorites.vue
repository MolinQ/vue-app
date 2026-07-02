<script setup lang="ts">
import FilmCard from "@/components/films/Card.vue";
import { useFavoritesStore } from "@/stores/favoritesStore";

const favoritesStore = useFavoritesStore();
</script>

<template>
  <section class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Favorites</h1>
    </div>

    <div
      v-if="favoritesStore.favorites.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <FilmCard
        v-for="film in favoritesStore.favorites"
        :key="film.id"
        :film="film"
      />
    </div>

    <div v-else class="rounded-2xl p-12 text-center">
      <p class="text-lg font-medium text-gray-900">No favorite movies</p>
    </div>
  </section>
</template>
