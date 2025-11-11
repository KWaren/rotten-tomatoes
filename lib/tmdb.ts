import axios from "axios";
import { Movie, MovieDetails, Genre, TMDBResponse } from "@/types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

if (!API_KEY || !BASE_URL || !IMAGE_BASE_URL) {
  console.error("Souci côté .env");
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
  } catch (error) {
    throw new Error("Error fetching popular movies");
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
