<script setup lang="ts">
import SearchInput from "@/components/common/form/SearchInput.vue";
import FilmService from "@/services/FilmsService";
import FilmCard from "@/components/films/Card.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MovieResponse } from "@/types/films";

const filmService = new FilmService();
const route = useRoute();
const router = useRouter();

const search = ref("");
const films = ref<MovieResponse | null>(null);
const loading = ref(false);
const currentPage = ref(1);

let timeout: number | undefined;
let skipSearchWatch = false;

function getQueryFromRoute() {
  return {
    q: (route.query.q as string) ?? "",
    page: Math.max(1, Number(route.query.page) || 1),
  };
}

function buildQuery(q: string, page: number) {
  const query: Record<string, string> = {};
  const trimmed = q.trim();

  if (trimmed) {
    query.q = trimmed;
  }

  if (page > 1) {
    query.page = String(page);
  }

  return query;
}

async function fetchFilms(q: string, page: number) {
  if (!q.trim()) {
    films.value = null;
    currentPage.value = 1;
    return;
  }

  try {
    loading.value = true;
    films.value = await filmService.searchFilms(q, false, page);
    currentPage.value = page;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function syncFromRoute() {
  const { q, page } = getQueryFromRoute();

  skipSearchWatch = true;
  search.value = q;
  skipSearchWatch = false;

  fetchFilms(q, page);
}

function updateRoute(q: string, page: number) {
  router.replace({
    path: "/search",
    query: buildQuery(q, page),
  });
}

watch(
  () => [route.query.q, route.query.page],
  () => {
    syncFromRoute();
  },
  { immediate: true },
);

watch(search, () => {
  if (skipSearchWatch) return;

  clearTimeout(timeout);

  timeout = window.setTimeout(() => {
    updateRoute(search.value, 1);
  }, 500);
});

function changePage(page: number) {
  updateRoute(search.value, page);
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
          Find your movie
        </h1>

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
        <vue-awesome-paginate
          v-if="films"
          :total-items="
            films.total_results < 15000 ? films.total_results : 15000
          "
          :items-per-page="30"
          :max-pages-shown="10"
          v-model="currentPage"
          @click="changePage"
        />
      </div>
    </div>
  </section>
</template>
