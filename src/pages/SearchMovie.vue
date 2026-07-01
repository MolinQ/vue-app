<script setup lang="ts">
import SearchInput from "@/components/common/form/SearchInput.vue";
import FilmService from "@/services/FilmsService";
import FilmCard from "@/components/films/Card.vue";
import { ref, watch } from "vue";
import type { MovieResponse } from "@/types/films";

const filmService = new FilmService();

const search = ref("");
const films = ref<MovieResponse | null>(null);
const loading = ref(false);

let timeout: number | undefined;

const searchFilms = async () => {
  if (!search.value.trim()) {
    films.value = null;
    return;
  }

  try {
    loading.value = true;

    const response = await filmService.searchFilms(search.value);

    films.value = response;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(search, () => {
  clearTimeout(timeout);

  timeout = window.setTimeout(() => {
    searchFilms();
  }, 500);
});

const loadFilms = async (page = 1) => {
  films.value = await filmService.searchFilms(search.value, false, page);
};

function changePage(page: number) {
  loadFilms(page);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <section class="flex min-h-[60vh] justify-center px-6 mt-7">
    <div class="w-full flex flex-col items-center">
      <div class="max-w-2xl text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Find your next movie
        </h1>

        <p class="mt-4 text-lg text-gray-500">
          Discover something to watch tonight.
        </p>

        <div class="mt-10">
          <SearchInput
            v-model="search"
            name="film"
            label="Search film"
            placeholder="Search movies..."
            class="w-full"
          />
        </div>
      </div>
      <div class="mt-5" v-if="loading">Loading...</div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5"
        v-else
      >
        <FilmCard v-for="film in films?.results" :key="film.id" :film="film" />
      </div>
      <div class="mt-8 flex justify-center pb-5">
        <!-- items 15000 , less then total_count in apy because they have limit -->
        <vue-awesome-paginate
          v-if="films"
          :total-items="
            films.total_results < 15000 ? films.total_results : 15000
          "
          :items-per-page="30"
          :max-pages-shown="10"
          v-model="films.page"
          @click="changePage"
        />
      </div>
    </div>
  </section>
</template>
