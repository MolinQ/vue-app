import type { MovieDetails, MovieResponse } from "@/types/films";
import { HttpService } from "./HttpService";

class FilmService extends HttpService {
  async getFilmList(page = 1): Promise<MovieResponse> {
    return this.get(`/movie/popular?language=en-US&page=${page}`);
  }

  async searchFilms(
    searchText: string,
    isAdult = false,
    page = 1,
  ): Promise<MovieResponse> {
    return this.get(
      `/search/movie?query=${encodeURIComponent(searchText)}&include_adult=${isAdult}&language=en-US&page=${page}`,
    );
  }

  async getFilmById(id: number): Promise<MovieDetails> {
    return this.get(`/movie/${id}?language=en-US`);
  }
}

export default FilmService;
