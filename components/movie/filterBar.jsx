"use client";

import { useState, useEffect } from "react";

export default function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  selectedYear,
  onYearChange,
  searchQuery,
  onSearchChange,
  sortBy = "popularity.desc",
  onSortChange,
  selectedDirector,
  onDirectorChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    // Récupérer la liste des directors depuis la base de données
    fetch("/api/directors")
      .then((res) => res.json())
      .then((data) => {
        if (data.directors) {
          setDirectors(data.directors);
        }
      })
      .catch((err) => console.error("Error fetching directors:", err));
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: "popularity.desc", label: "By the most popular" },
    { value: "popularity.asc", label: "By the least popular" },
    { value: "release_date.desc", label: "More recent" },
    { value: "release_date.asc", label: "Less recent" },
    { value: "title.asc", label: "Title (A-Z)" },
  ];

  const hasActiveFilters =
    selectedGenre || selectedYear || searchQuery || selectedDirector;

  const resetFilters = () => {
    onGenreChange(null);
    onYearChange(null);
    onSearchChange("");
    if (onDirectorChange) onDirectorChange(null);
    if (onSortChange) onSortChange("popularity.desc");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-linear-to-r from-yellow-500 to-yellow-600">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            Filter & Search
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Toggle filters"
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      <div
        className={`p-6 space-y-4 ${isExpanded ? "block" : "hidden lg:block"}`}
      >
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
              />
            </svg>
            Search a Movie
          </label>
          <input
            type="text"
            placeholder="Title of movie..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          {searchQuery && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Search : "{searchQuery}"
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Genre
            </label>
            <select
              value={selectedGenre || ""}
              onChange={(e) =>
                onGenreChange(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              <span className="flex gap-2">Year</span>
            </label>
            <select
              value={selectedYear || ""}
              onChange={(e) =>
                onYearChange(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Director
          </label>
          <select
            value={selectedDirector || ""}
            onChange={(e) =>
              onDirectorChange && onDirectorChange(e.target.value || null)
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All directors</option>
            {directors.map((director) => (
              <option key={director} value={director}>
                {director}
              </option>
            ))}
          </select>
        </div>

        {onSortChange && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Filter by
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Reset filters
          </button>
        )}

        {hasActiveFilters && (
          <div className="bg-red-50 dark:bg-yellow-600 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-white font-medium mb-1">
              Active Filters :
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {searchQuery && (
                <span className="bg-white dark:bg-green-700 text-white dark:text-white px-2 py-1 rounded">
                  Search: {searchQuery}
                </span>
              )}
              {selectedGenre && (
                <span className="bg-white dark:bg-green-700 text-white dark:text-white px-2 py-1 rounded">
                  Genre: {genres.find((g) => g.id === selectedGenre)?.name}
                </span>
              )}
              {selectedYear && (
                <span className="bg-white dark:bg-green-700 text-white dark:text-white px-2 py-1 rounded">
                  Year: {selectedYear}
                </span>
              )}
              {selectedDirector && (
                <span className="bg-white dark:bg-green-700 text-white dark:text-white px-2 py-1 rounded">
                  Director: {selectedDirector}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
