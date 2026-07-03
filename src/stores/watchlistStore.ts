import { defineStore } from "pinia";
import { localStorageKeys } from "@/constants/storageVariables";
import { LocalStorageService } from "@/services/StorageService";
import type { Movie, MovieDetails } from "@/types/films";

const storage = new LocalStorageService();

function toWatchlistMovie(movie: Movie | MovieDetails): Movie {
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

export const useWatchlistStore = defineStore("watchlist", {
  state: () => ({
    watchlist: [] as Movie[],
    isInitialized: false,
  }),

  getters: {
    isInWatchlist: (state) => (id: number) =>
      state.watchlist.some((movie) => movie.id === id),
  },

  actions: {
    init() {
      if (this.isInitialized) return;

      const data = storage.get(localStorageKeys.WATCHLIST);

      if (data) {
        try {
          this.watchlist = JSON.parse(data) as Movie[];
        } catch {
          this.watchlist = [];
          storage.remove(localStorageKeys.WATCHLIST);
        }
      }

      this.isInitialized = true;
    },

    persist() {
      storage.set(localStorageKeys.WATCHLIST, this.watchlist);
    },

    addToWatchlist(movie: Movie | MovieDetails) {
      const watchlistMovie = toWatchlistMovie(movie);

      if (this.isInWatchlist(watchlistMovie.id)) return;

      this.watchlist.push(watchlistMovie);
      this.persist();
    },

    removeFromWatchlist(id: number) {
      this.watchlist = this.watchlist.filter((movie) => movie.id !== id);
      this.persist();
    },

    toggleWatchlist(movie: Movie | MovieDetails) {
      const watchlistMovie = toWatchlistMovie(movie);

      if (this.isInWatchlist(watchlistMovie.id)) {
        this.removeFromWatchlist(watchlistMovie.id);
        return;
      }

      this.addToWatchlist(watchlistMovie);
    },
  },
});
