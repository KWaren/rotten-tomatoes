"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/movie/FavoriteButton";
import CommentSection from "@/components/comments/CommentSection";
import CastSlider from "@/components/movie/CastSlider";
import AuthenticatedHeader from "@/components/layout/AuthenticatedHeader";

const getImageUrl = (path, size = "w500") => {
  if (!path) return "/default-Movie-image.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  return `${baseUrl}/${size}${path}`;
};

export default function MovieClientPage({ movie }) {
  const [movieData, setMovieData] = useState(movie);

  useEffect(() => {
    // Refresh movie data when ratings change
    const handleRatingUpdate = async () => {
      try {
        const response = await fetch(`/api/movies/${movie.id}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setMovieData(data);
        }
      } catch (error) {
        console.error("Error refreshing movie data:", error);
      }
    };

    // Listen for custom event from StarRating component
    window.addEventListener("ratingUpdated", handleRatingUpdate);
    return () =>
      window.removeEventListener("ratingUpdated", handleRatingUpdate);
  }, [movie.id]);

  const releaseYear = movieData.releaseDate
    ? new Date(movieData.releaseDate).getFullYear()
    : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader />

      <div className="relative h-[300px] md:h-[500px] w-full">
        <Image
          src={getImageUrl(movieData.backdropUrl, "original")}
          alt={movieData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back
          </Link>
          {movieData.averageRating !== undefined &&
            movieData.averageRating > 0 && (
              <span className="ml-4 inline-flex items-center gap-1 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
                ⭐ {movieData.averageRating.toFixed(1)}/10
              </span>
            )}
          {movieData._count?.ratings && (
            <span className="ml-2 inline-flex items-center gap-1 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
              {movieData._count.ratings}{" "}
              {movieData._count.ratings > 1 ? "notes" : "note"}
            </span>
          )}
        </div>

        {/*Rate for the movie from our DB*/}
      </div>

      <main className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(movieData.posterUrl, "w500")}
                alt={movieData.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                  {movieData.title}
                </h1>
                {movieData.originalTitle &&
                  movieData.originalTitle !== movieData.title && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-2">
                      ({movieData.originalTitle})
                    </p>
                  )}
                {movieData.tagline && (
                  <p className="text-xl text-gray-700 dark:text-gray-300 italic">
                    "{movieData.tagline}"
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  {releaseYear}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {movieData.runtime
                    ? `${Math.floor(movieData.runtime / 60)}h ${
                        movieData.runtime % 60
                      }min`
                    : "N/A"}
                </span>
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {movieData.status}
                </span>

                <div className="ml-auto">
                  <FavoriteButton
                    movieId={movie.id}
                    initialFavorites={movieData.favorites || []}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {Array.isArray(movieData.genres) &&
                  movieData.genres.length > 0 &&
                  movieData.genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      {typeof g === "string" ? g : g.name}
                    </span>
                  ))}
              </div>

              {movieData.director && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Director:</span>
                  <span>{movieData.director}</span>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Synopsis
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {movieData.description || "No synopsis available."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {movieData.budget && Number(movieData.budget) > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Budget
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("us-EN", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(Number(movieData.budget))}
                    </p>
                  </div>
                )}
                {movieData.revenue && Number(movieData.revenue) > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Revenue
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("us-EN", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(Number(movieData.revenue))}
                    </p>
                  </div>
                )}
                {movieData.homepage && (
                  <div className="col-span-2">
                    <a
                      href={movieData.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Official site
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Casting */}
        {Array.isArray(movieData.cast) && movieData.cast.length > 0 && (
          <CastSlider cast={movieData.cast} />
        )}

        {Array.isArray(movieData.productionCompanies) &&
          movieData.productionCompanies.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Production
              </h2>
              <div className="flex flex-wrap gap-6">
                {movieData.productionCompanies.map((company, idx) => (
                  <div
                    key={company.id || idx}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    {company.logoPath && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={getImageUrl(company.logoPath, "w92")}
                          alt={company.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span className="text-sm">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Gil */}
        <CommentSection movieId={movie.id} />
      </main>
    </div>
  );
}
