<script setup lang="ts">
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import Loader from "@/components/common/Loader.vue";
import FilmCard from "@/components/films/Card.vue";
import FilmService from "@/services/FilmsService";
import { getErrorMessage } from "@/types/http";
import type { MovieResponse } from "@/types/films";
import { ref, watch } from "vue";

const films = ref<MovieResponse | null>(null);
const loading = ref(true);
const error = ref("");
const currentPage = ref(1);

const filmService = new FilmService();

const loadFilms = async (page = 1) => {
  try {
    loading.value = true;
    error.value = "";
    currentPage.value = page;
    films.value = await filmService.getFilmList(page);
  } catch (err) {
    error.value = getErrorMessage(err);
    films.value = null;
  } finally {
    loading.value = false;
  }
};

watch(
  currentPage,
  (page) => {
    loadFilms(page);
  },
  { immediate: true },
);
</script>

<template>
  <Loader v-if="loading" centered />

  <div v-else-if="error" class="p-6">
    <ErrorMessage
      :message="error"
      retry
      centered
      @retry="loadFilms(currentPage)"
    />
  </div>

  <div v-else-if="films && !films.results.length" class="p-6">
    <EmptyState
      title="No movies found"
      description="Popular movies list is empty. Try again later."
    />
  </div>

  <div v-else-if="films" class="p-6">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
    >
      <FilmCard v-for="film in films.results" :key="film.id" :film="film" />
    </div>
    <div class="mt-8 flex justify-center pb-5">
      <vue-awesome-paginate
        :total-items="15000"
        :items-per-page="30"
        :max-pages-shown="10"
        v-model="currentPage"
      />
    </div>
  </div>
</template>
