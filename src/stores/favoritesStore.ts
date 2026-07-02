import { defineStore } from "pinia";
import { localStorageKeys } from "@/constants/storageVariables";
import { LocalStorageService } from "@/services/StorageService";
import type { Movie, MovieDetails } from "@/types/films";

const storage = new LocalStorageService();

export function toFavoriteMovie(movie: Movie | MovieDetails): Movie {
  if ("genre_ids" in movie) {
    return movie;
  }

  return {
    adult: movie.adult,
    backdrop_path: movie.backdrop_path,
    genre_ids: movie.genres.map((genre) => genre.id),
    id: movie.id,
    title: movie.title,
    original_language: "",
    original_title: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    softcore: false,
    video: false,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
  };
}

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favorites: [] as Movie[],
    isInitialized: false,
  }),

  getters: {
    isFavorite: (state) => (id: number) =>
      state.favorites.some((movie) => movie.id === id),
  },

  actions: {
    init() {
      if (this.isInitialized) return;

      const data = storage.get(localStorageKeys.FAVORITES);

      if (data) {
        this.favorites = JSON.parse(data) as Movie[];
      }

      this.isInitialized = true;
    },

    persist() {
      storage.set(localStorageKeys.FAVORITES, this.favorites);
    },

    addFavorite(movie: Movie | MovieDetails) {
      const favoriteMovie = toFavoriteMovie(movie);

      if (this.isFavorite(favoriteMovie.id)) return;

      this.favorites.push(favoriteMovie);
      this.persist();
    },

    removeFavorite(id: number) {
      this.favorites = this.favorites.filter((movie) => movie.id !== id);
      this.persist();
    },

    toggleFavorite(movie: Movie | MovieDetails) {
      const favoriteMovie = toFavoriteMovie(movie);

      if (this.isFavorite(favoriteMovie.id)) {
        this.removeFavorite(favoriteMovie.id);
        return;
      }

      this.addFavorite(favoriteMovie);
    },
  },
});
