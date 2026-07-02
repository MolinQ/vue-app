<script setup lang="ts">
import FilmCard from "@/components/films/Card.vue";
import { useWatchlistStore } from "@/stores/watchlistStore";

const watchlistStore = useWatchlistStore();
</script>

<template>
  <section class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Watch Later</h1>
      <p class="mt-2 text-gray-500">Movies you plan to watch</p>
    </div>

    <div
      v-if="watchlistStore.watchlist.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <FilmCard
        v-for="film in watchlistStore.watchlist"
        :key="film.id"
        :film="film"
      />
    </div>

    <div v-else class="rounded-2xl p-12 text-center">
      <p class="text-lg font-medium text-gray-900">No movies in watch later</p>
      <p class="mt-2 text-gray-500">
        Add movies from home, search, or movie details.
      </p>
    </div>
  </section>
</template>
