<script setup lang="ts">
import type { Movie } from "@/types/films";
import FavoriteButton from "@/components/films/FavoriteButton.vue";

defineProps<{
  film: Movie;
}>();
</script>

<template>
  <RouterLink :to="`/movie/${film.id}`" class="relative block">
    <div class="absolute top-3 right-3 z-10">
      <FavoriteButton :film="film" />
    </div>

    <div
      class="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition duration-300 cursor-pointer"
    >
      <img
        :src="`https://image.tmdb.org/t/p/w500${film.poster_path}`"
        :alt="film.title"
        class="w-full h-80 object-cover"
      />

      <div class="p-4 flex flex-col gap-3">
        <h2 class="text-lg font-bold text-gray-900 line-clamp-1">
          {{ film.title }}
        </h2>

        <p class="text-sm text-gray-500 line-clamp-3">
          {{ film.overview }}
        </p>

        <div class="flex justify-between items-center mt-2">
          <span class="text-sm text-gray-600">
            {{ film.release_date }}
          </span>

          <div class="bg-yellow-400 px-2 py-1 rounded-lg text-sm font-semibold">
            Rating {{ film.vote_average.toFixed(1) }} / 10
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
