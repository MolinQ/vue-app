<script setup lang="ts">
import { RouterLink } from "vue-router";

import EmptyState from "@/components/common/EmptyState.vue";
import Button from "@/components/common/MainButton.vue";
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

    <EmptyState
      v-else
      title="No favorite movies"
      description="Browse movies and add to your favorites"
    >
      <RouterLink to="/" class="text-blue-600 hover:underline font-medium">
        Browse movies
      </RouterLink>
    </EmptyState>
  </section>
</template>
