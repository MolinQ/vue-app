<script lang="ts" setup>
import Button from "@/components/common/MainButton.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import Loader from "@/components/common/Loader.vue";
import FavoriteButton from "@/components/films/FavoriteButton.vue";
import WatchLaterButton from "@/components/films/WatchLaterButton.vue";
import FilmService from "@/services/FilmsService";
import { getErrorMessage } from "@/types/http";
import type { MovieDetails } from "@/types/films";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const filmService = new FilmService();

const movie = ref<MovieDetails | null>(null);
const loading = ref(true);
const error = ref("");

const fetchFilm = async () => {
  const id = Number(route.params.id);

  if (!Number.isFinite(id)) {
    error.value = "Invalid movie ID.";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    movie.value = await filmService.getFilmById(id);
  } catch (err) {
    error.value = getErrorMessage(err);
    movie.value = null;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchFilm();
});
</script>

<template>
  <div v-if="loading" class="p-8">
    <Loader centered />
  </div>

  <div v-else-if="error" class="p-8">
    <Button size="sm" variant="primary" @click="goBack">Back</Button>

    <div class="mt-6">
      <ErrorMessage :message="error" retry centered @retry="fetchFilm" />
    </div>
  </div>

  <div v-else-if="movie" class="min-h-screen bg-gray-100 p-8">
    <Button size="sm" variant="primary" @click="goBack"> Back </Button>

    <div
      class="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mt-3.5"
    >
      <div class="grid md:grid-cols-3 gap-8 p-8">
        <div>
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="rounded-2xl w-full"
          />
        </div>

        <div class="md:col-span-2 flex flex-col gap-5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-4xl font-bold">
              {{ movie.title }}
            </h1>

            <div class="flex items-center gap-2">
              <WatchLaterButton :film="movie" />
              <FavoriteButton :film="movie" />
            </div>
          </div>

          <div class="flex gap-3 items-center">
            <div class="bg-yellow-400 px-4 py-2 rounded-xl font-bold">
              Rating {{ movie.vote_average.toFixed(1) }} / 10
            </div>

            <span class="text-gray-500"> {{ movie.vote_count }} votes </span>
          </div>

          <p class="text-gray-700 leading-7">
            {{ movie.overview }}
          </p>

          <div>
            <b>Release date:</b>
            {{ movie.release_date }}
          </div>

          <div class="flex gap-2 flex-wrap">
            <b>Genre:</b>

            <span
              v-for="genre in movie.genres"
              :key="genre.id"
              class="bg-gray-200 px-3 py-1 rounded-full"
            >
              {{ genre.name }}
            </span>
          </div>

          <div>
            <b>Duration:</b>
            {{ movie.runtime }} minutes
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
