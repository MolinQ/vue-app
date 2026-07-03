<script setup lang="ts">
import { RouterLink } from "vue-router";

import EmptyState from "@/components/common/EmptyState.vue";
import FilmCard from "@/components/films/Card.vue";
import { useWatchlistStore } from "@/stores/watchlistStore";

const watchlistStore = useWatchlistStore();
</script>

<template>
  <section class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Watch Later</h1>
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

    <EmptyState
      v-else
      title="No movies in watch later"
      description="Add movies from home, search, or movie details"
    >
      <RouterLink
        to="/search"
        class="text-blue-600 hover:underline font-medium"
      >
        Search movies
      </RouterLink>
    </EmptyState>
  </section>
</template>
