"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const getImageUrl = (path, size = "w500") => {
  if (!path) return "/default-Movie-image.jpg";
  const baseUrl =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  return `${baseUrl}/${size}${path}`;
};

const isValidUrl = (urlString) => {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function MovieCard({
  movie,
  variant = "user",
  basePath = "/movies",
}) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  let imageUrl = "/default-Movie-image.jpg";

  if (movie.posterUrl && isValidUrl(movie.posterUrl)) {
    imageUrl = movie.posterUrl;
  } else if (movie.poster_path) {
    imageUrl = getImageUrl(movie.poster_path);
  }

  const releaseDate = movie.releaseDate || movie.release_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

  const handleAddMovie = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setImporting(true);
    try {
      const response = await fetch("/api/admin/import-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbId: movie.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setImported(true);
        setTimeout(() => setImported(false), 10000);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleNavigate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated by calling our /api/me endpoint.
    // If not authenticated, redirect to login. Otherwise navigate to movie page.
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!json || !json.user) {
        router.push("/login");
        return;
      }

      router.push(`${basePath}/${movie.id}`);
    } catch (err) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800">
        <Link href={`${basePath}/${movie.id}`} onClick={handleNavigate}>
          <div className="relative aspect-2/3 w-full bg-gray-200 dark:bg-gray-700">
            <Image
              src={imageUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={false}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2 min-h-14 text-gray-900 dark:text-white">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {releaseYear}
              </span>

              <div className="flex items-center gap-1">
                <span className="text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-yellow-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {movie.averageRating && movie.averageRating > 0
                    ? movie.averageRating.toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {movie._count?.ratings || 0} votes
            </div>
          </div>
        </Link>
      </div>

      {variant === "admin" && (
        <button
          onClick={handleAddMovie}
          disabled={importing || imported}
          className={`w-full mt-2 px-4 py-2 font-bold text-sm hover:cursor-pointer transition-all ${
            imported
              ? "bg-green-600 text-white"
              : importing
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-white/0 hover:bg-red-700 text-white shadow-lg hover:shadow-xl border border-red-500"
          }`}
        >
          {imported ? "Ajouté" : importing ? "..." : "+ ADD"}
        </button>
      )}
    </div>
  );
}
