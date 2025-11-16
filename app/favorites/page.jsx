"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthenticatedHeader from "@/components/layout/AuthenticatedHeader";
import MovieList from "@/components/movie/MovieList";
import Footer from "@/components/layout/Footer";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchFavorites();

    // Listen for favorite updates from other components
    const handleFavoriteUpdate = () => {
      fetchFavorites();
    };
    window.addEventListener("favoriteUpdated", handleFavoriteUpdate);

    return () => {
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdate);
    };
  }, [user, authLoading, router]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/movies?userId=${user.id}`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch favorites");

      const data = await response.json();

      const favMovies =
        data.movies?.filter((movie) =>
          movie.favorites?.some((fav) => fav.userId === user.id)
        ) || [];

      setFavorites(favMovies);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AuthenticatedHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-900 dark:text-white text-xl">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <svg
              className="w-12 h-12 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            My Favorite Movies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {favorites.length} movie{favorites.length > 1 ? "s" : ""} in your
            list
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-8">
            {error}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding movies to your favorites!
            </p>
            <Link
              href="/movies"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse movies
            </Link>
          </div>
        ) : (
          <MovieList movies={favorites} variant="user" basePath="/movies" />
        )}
      </main>
      <Footer />
    </div>
  );
}
