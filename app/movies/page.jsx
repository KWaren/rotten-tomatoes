"use client";

import { useState, useEffect } from "react";
import MovieList from "@/components/movie/MovieList";
import FilterBar from "@/components/movie/filterBar";
import AuthenticatedHeader from "@/components/layout/AuthenticatedHeader";
import Footer from "@/components/layout/Footer";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetch("/api/movies?limit=1000");
        const data = await res.json();
        setAllMovies(data.movies || []);

        // Extraire tous les genres uniques depuis le tableau genres de chaque film
        const allGenres = data.movies.flatMap((m) => m.genres || []);
        const uniqueGenres = [...new Set(allGenres)].filter(Boolean).sort();
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
        filteredMovies = filteredMovies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            movie.director?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedGenre) {
        const genreName = genres.find((g) => g.id === selectedGenre)?.name;
        filteredMovies = filteredMovies.filter(
          (movie) => movie.genres && movie.genres.includes(genreName)
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

      if (selectedDirector) {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.director === selectedDirector
        );
      }

      filteredMovies = sortMovies(filteredMovies, sortBy);

      setMovies(filteredMovies);
      setLoading(false);
    };

    // Appliquer les filtres immédiatement sans délai
    filterMovies();
  }, [
    allMovies,
    selectedGenre,
    selectedYear,
    searchQuery,
    selectedDirector,
    sortBy,
    genres,
  ]);

  const sortMovies = (moviesList, sortOption) => {
    const sorted = [...moviesList];

    switch (sortOption) {
      case "popularity.desc":
        return sorted.sort(
          (a, b) => (b._count?.favorites || 0) - (a._count?.favorites || 0)
        );
      case "popularity.asc":
        return sorted.sort(
          (a, b) => (a._count?.favorites || 0) - (b._count?.favorites || 0)
        );
      case "vote_average.desc":
        return sorted.sort(
          (a, b) => (b._count?.ratings || 0) - (a._count?.ratings || 0)
        );
      case "vote_average.asc":
        return sorted.sort(
          (a, b) => (a._count?.ratings || 0) - (b._count?.ratings || 0)
        );
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
      <AuthenticatedHeader />

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
                selectedDirector={selectedDirector}
                onDirectorChange={setSelectedDirector}
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

      <Footer />
    </div>
  );
}
