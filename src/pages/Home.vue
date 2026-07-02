<script setup lang="ts">
import FilmService from "@/services/FilmsService";
import { ref, onMounted } from "vue";
import type { MovieResponse } from "@/types/films";
import FilmCard from "@/components/films/Card.vue";

const films = ref<MovieResponse | null>(null);

const filmService = new FilmService();

const loadFilms = async (page = 1) => {
  films.value = await filmService.getFilmList(page);
  console.log(films.value);
};

onMounted(async () => {
  loadFilms();
});

function changePage(page: number) {
  loadFilms(page);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <div v-if="films" class="p-6">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
    >
      <FilmCard v-for="film in films.results" :key="film.id" :film="film" />
    </div>
    <div class="mt-8 flex justify-center pb-5">
      <!-- items 15000 , less then total_count in apy because they have limit -->
      <vue-awesome-paginate
        :total-items="15000"
        :items-per-page="30"
        :max-pages-shown="10"
        v-model="films.page"
        @click="changePage"
      />
    </div>
  </div>
</template>
