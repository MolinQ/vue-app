<script setup lang="ts">
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useAuthStore } from "@/stores/authStore";
import type { Movie, MovieDetails } from "@/types/films";
import { computed } from "vue";

const props = defineProps<{
  film: Movie | MovieDetails;
}>();

const authStore = useAuthStore();
const watchlistStore = useWatchlistStore();

const isInWatchlist = computed(() =>
  watchlistStore.isInWatchlist(props.film.id),
);

const toggleWatchlist = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  watchlistStore.toggleWatchlist(props.film);
};
</script>

<template>
  <button
    v-if="authStore.isAuthenticated"
    type="button"
    :aria-label="
      isInWatchlist ? 'Remove from watch later' : 'Add to watch later'
    "
    class="rounded-full bg-white/90 p-2 shadow-md transition hover:scale-110"
    @click="toggleWatchlist"
  >
    <span class="text-xl leading-none cursor-pointer">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V8.82843C21 8.29799 20.7893 7.78929 20.4142 7.41421L16.5858 3.58579C16.2107 3.21071 15.702 3 15.1716 3H5Z"
          :fill="isInWatchlist ? '#2563EB' : '#9CA3AF'"
        />
        <path
          d="M15 3V7C15 8.10457 15.8954 9 17 9H21"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </span>
  </button>
</template>
