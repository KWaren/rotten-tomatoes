"use client";

import { useState, useEffect } from "react";
import logo from "@/public/Logo.png";
import {
  get_genres,
  get_movies_by_genre,
  search_movies,
  get_popular_movies,
} from "@/lib/tmdb";
import MovieList from "@/components/movie/MovieList";
import FilterBar from "@/components/movie/filterBar";
import Link from "next/link";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await get_genres();
        setGenres(genresList);
      } catch (error) {
        console.error("Erreur lors du chargement des genres:", error);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetchMovies = async () => {
      try {
        let data;

        if (searchQuery.trim()) {
          data = await search_movies(searchQuery, 1);
        } else if (selectedGenre) {
          data = await get_movies_by_genre(selectedGenre, 1);
        } else {
          data = await get_popular_movies(1);
        }

        let filteredMovies = data.results;

        if (selectedYear) {
          filteredMovies = filteredMovies.filter((movie) => {
            const movieYear = new Date(movie.release_date).getFullYear();
            return movieYear === selectedYear;
          });
        }

        filteredMovies = sortMovies(filteredMovies, sortBy);

        setMovies(filteredMovies);
      } catch (error) {
        console.error("Error while fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchMovies, 10000);
    return () => clearTimeout(timer);
  }, [selectedGenre, selectedYear, searchQuery, sortBy]);

  const sortMovies = (moviesList, sortOption) => {
    const sorted = [...moviesList];

    switch (sortOption) {
      case "popularity.desc":
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case "popularity.asc":
        return sorted.sort((a, b) => a.popularity - b.popularity);
      case "vote_average.desc":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "vote_average.asc":
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      case "release_date.desc":
        return sorted.sort(
          (a, b) =>
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
        );
      case "release_date.asc":
        return sorted.sort(
          (a, b) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
        );
      case "title.asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Logo"
                width={50}
                height={50}
                className="px-0 py-0"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-red-600">
                My Rotten Tomatoes
              </h1>
            </Link>

            <nav className="flex gap-4 md:gap-6 text-sm md:text-base">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="text-red-600 dark:text-red-500 font-bold border-b-2 border-red-600"
              >
                Movies
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterBar
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
                    Loading movies...
                  </p>
                </div>
              </div>
            ) : (
              <MovieList
                movies={movies}
                title={searchQuery ? `Result for "${searchQuery}"` : undefined}
                variant="admin"
                basePath="/admin/movies-tmdb"
              />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="flex justify-center items-center gap-2 text-gray-400">
            © 2025 My Rotten Tomatoes - Made with
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            by 2WLG Team
          </p>
        </div>
      </footer>
    </div>
  );
}
