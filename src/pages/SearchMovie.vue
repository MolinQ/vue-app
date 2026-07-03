<script setup lang="ts">
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import Loader from "@/components/common/Loader.vue";
import SearchInput from "@/components/common/form/SearchInput.vue";
import FilmCard from "@/components/films/Card.vue";
import FilmService from "@/services/FilmsService";
import { getErrorMessage } from "@/types/http";
import type { MovieResponse } from "@/types/films";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const filmService = new FilmService();
const route = useRoute();
const router = useRouter();

const search = ref("");
const films = ref<MovieResponse | null>(null);
const loading = ref(false);
const error = ref("");
const currentPage = ref(1);

let timeout: number | undefined;
let skipSearchWatch = false;

const hasSearchQuery = computed(() => search.value.trim().length > 0);

const emptyResultsTitle = computed(() =>
  hasSearchQuery.value
    ? `No movies found for "${search.value.trim()}"`
    : "Enter a movie title to search",
);

const emptyResultsDescription = computed(() =>
  hasSearchQuery.value
    ? "Try a different search term or check the spelling."
    : "Start typing in the search field above.",
);

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
    error.value = "";
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    films.value = await filmService.searchFilms(q, false, page);
    currentPage.value = page;
  } catch (err) {
    error.value = getErrorMessage(err);
    films.value = null;
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

function retrySearch() {
  const { q, page } = getQueryFromRoute();
  fetchFilms(q, page);
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

      <Loader v-if="loading" class="mt-5" centered />

      <ErrorMessage
        v-else-if="error"
        class="mt-5 w-full max-w-2xl"
        :message="error"
        retry
        centered
        @retry="retrySearch"
      />

      <EmptyState
        v-else-if="!hasSearchQuery || (films && !films.results.length)"
        class="mt-5 w-full max-w-2xl"
        :title="emptyResultsTitle"
        :description="emptyResultsDescription"
      />

      <div
        v-else-if="films"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5 w-full"
      >
        <FilmCard v-for="film in films.results" :key="film.id" :film="film" />
      </div>

      <div class="mt-8 flex justify-center pb-5">
        <vue-awesome-paginate
          v-if="films && films.results.length"
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
