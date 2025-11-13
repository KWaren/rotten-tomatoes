"use client";

import { useState, useEffect } from "react";
import MovieList from "@/components/movie/MovieList";
import FilterBar from "@/components/movie/filterBar";
import Link from "next/link";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetch("/api/movies?limit=1000");
        const data = await res.json();
        setAllMovies(data.movies || []);
        
        const uniqueGenres = [...new Set(data.movies.map(m => m.genre).filter(Boolean))];
        setGenres(uniqueGenres.map((name, index) => ({ id: index + 1, name })));
      } catch (error) {
        console.error("Error while loading movies:", error);
        setAllMovies([]);
      }
    };
    loadMovies();
  }, []);

  useEffect(() => {
    setLoading(true);

    const filterMovies = () => {
      let filteredMovies = [...allMovies];

      if (searchQuery.trim()) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedGenre) {
        const genreName = genres.find(g => g.id === selectedGenre)?.name;
        filteredMovies = filteredMovies.filter((movie) =>
          movie.genre === genreName
        );
      }

      if (selectedYear) {
        filteredMovies = filteredMovies.filter((movie) => {
          const movieYear = movie.releaseDate
            ? new Date(movie.releaseDate).getFullYear()
            : null;
          return movieYear === selectedYear;
        });
      }

      filteredMovies = sortMovies(filteredMovies, sortBy);

      setMovies(filteredMovies);
      setLoading(false);
    };

    const timer = setTimeout(filterMovies, 300);
    return () => clearTimeout(timer);
  }, [allMovies, selectedGenre, selectedYear, searchQuery, sortBy, genres]);

  const sortMovies = (moviesList, sortOption) => {
    const sorted = [...moviesList];

    switch (sortOption) {
      case "popularity.desc":
        return sorted.sort((a, b) => (b._count?.favorites || 0) - (a._count?.favorites || 0));
      case "popularity.asc":
        return sorted.sort((a, b) => (a._count?.favorites || 0) - (b._count?.favorites || 0));
      case "vote_average.desc":
        return sorted.sort((a, b) => (b._count?.ratings || 0) - (a._count?.ratings || 0));
      case "vote_average.asc":
        return sorted.sort((a, b) => (a._count?.ratings || 0) - (b._count?.ratings || 0));
      case "release_date.desc":
        return sorted.sort(
          (a, b) =>
            new Date(b.releaseDate || 0).getTime() -
            new Date(a.releaseDate || 0).getTime()
        );
      case "release_date.asc":
        return sorted.sort(
          (a, b) =>
            new Date(a.releaseDate || 0).getTime() -
            new Date(b.releaseDate || 0).getTime()
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
              <span className="text-4xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 text-white-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                  />
                </svg>
              </span>
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
                variant="user"
                basePath="/movies"
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
