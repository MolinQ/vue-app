<script setup lang="ts">
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuthStore } from "@/stores/authStore";
import type { Movie, MovieDetails } from "@/types/films";
import { computed } from "vue";

const props = defineProps<{
  film: Movie | MovieDetails;
}>();

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const isFavorite = computed(() => favoritesStore.isFavorite(props.film.id));

const toggleFavorite = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  favoritesStore.toggleFavorite(props.film);
};
</script>

<template>
  <button
    v-if="authStore.isAuthenticated"
    type="button"
    :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
    class="rounded-full bg-white/90 p-2 shadow-md transition hover:scale-110"
    @click="toggleFavorite"
  >
    <span class="text-xl leading-none cursor-pointer">
      <svg
        v-if="isFavorite"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21L10.55 19.7C5.4 15.05 2 11.95 2 8.15C2 5.05 4.42 2.5 7.5 2.5C9.24 2.5 10.91 3.31 12 4.59C13.09 3.31 14.76 2.5 16.5 2.5C19.58 2.5 22 5.05 22 8.15C22 11.95 18.6 15.05 13.45 19.71L12 21Z"
          fill="#FF3B30"
        />
      </svg>
      <svg
        v-else
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21L10.55 19.7C5.4 15.05 2 11.95 2 8.15C2 5.05 4.42 2.5 7.5 2.5C9.24 2.5 10.91 3.31 12 4.59C13.09 3.31 14.76 2.5 16.5 2.5C19.58 2.5 22 5.05 22 8.15C22 11.95 18.6 15.05 13.45 19.71L12 21Z"
          fill="#9CA3AF"
        />
      </svg>
    </span>
  </button>
</template>
