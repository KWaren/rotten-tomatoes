import axios from "axios";
import { Movie, MovieDetails, Genre, TMDBResponse } from "@/types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

if (!API_KEY || !BASE_URL || !IMAGE_BASE_URL) {
  console.error("Configuration manquante dans .env");
  console.error("API_KEY:", API_KEY ? "OK" : "PAS OK");
  console.error("BASE_URL:", BASE_URL ? "OK" : "PAS OK");
  console.error("IMAGE_BASE_URL:", IMAGE_BASE_URL ? "OK" : "PAS OK");
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export const get_popular_movies = async (
  page: number = 1
): Promise<TMDBResponse<Movie>> => {
  try {
    const response = await api.get("/movie/popular", { params: { page } });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching popular movies:", error.message);
    throw new Error(`Error fetching popular movies: ${error.message}`);
  }
};

export const get_top_rated_movies = async (
  page: number = 1
): Promise<TMDBResponse<Movie>> => {
  try {
    const response = await api.get("/movie/top_rated", { params: { page } });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching top rated movies:", error.message);
    throw new Error(`Error fetching top rated movies: ${error.message}`);
  }
};

export const get_movie_details = async (
  movieId: number
): Promise<MovieDetails> => {
  try {
    console.log(`[TMDB] Fetching movie details for ID: ${movieId}`);
    console.log(`[TMDB] Request URL: ${BASE_URL}/movie/${movieId}`);

    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits",
      },
    });

    console.log(`[TMDB] Successfully fetched movie: ${response.data.title}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `[TMDB] Error fetching movie ${movieId}:`,
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const get_genres = async (): Promise<Genre[]> => {
  try {
    const response = await api.get("/genre/movie/list");
    return response.data.genres;
  } catch (error) {
    throw new Error("Error fetching genres");
  }
};

export const get_movies_by_genre = async (
  genreId: number,
  page: number = 1
): Promise<TMDBResponse<Movie>> => {
  try {
    const response = await api.get("/discover/movie", {
      params: { with_genres: genreId, page },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching movies by genre");
  }
};

export const search_movies = async (
  query: string,
  page: number = 1
): Promise<TMDBResponse<Movie>> => {
  try {
    const response = await api.get("search/movie", { params: { query, page } });
    return response.data;
  } catch (error) {
    throw new Error("Error searching movies");
  }
};
