import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/movie/FavoriteButton";
import CommentSection from "@/components/comments/CommentSection";

const getImageUrl = (path, size = "w500") => {
  if (!path) return "/default-Movie-image.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  return `${baseUrl}/${size}${path}`;
};

async function getMovieFromDB(id) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/movies/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const movie = await getMovieFromDB(id);

  if (!movie) notFound();

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
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
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors"
              >
                Movies
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="relative h-[300px] md:h-[500px] w-full">
        <Image
          src={getImageUrl(movie.backdropUrl, "original")}
          alt={movie.title}
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
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(movie.posterUrl, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                  {movie.title}
                </h1>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-2">
                    ({movie.originalTitle})
                  </p>
                )}
                {movie.tagline && (
                  <p className="text-xl text-gray-700 dark:text-gray-300 italic">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  {releaseYear}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {movie.runtime
                    ? `${Math.floor(movie.runtime / 60)}h ${
                        movie.runtime % 60
                      }min`
                    : "N/A"}
                </span>
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {movie.status}
                </span>

                <div className="ml-auto">
                  <FavoriteButton
                    movieId={movie.id}
                    initialFavorites={movie.favorites || []}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {Array.isArray(movie.genres) &&
                  movie.genres.length > 0 &&
                  movie.genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      {typeof g === "string" ? g : g.name}
                    </span>
                  ))}
              </div>

              {movie.director && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Director:</span>
                  <span>{movie.director}</span>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Synopsis
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {movie.description || "Aucun synopsis disponible."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {movie.budget && Number(movie.budget) > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Budget
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("us-EN", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(Number(movie.budget))}
                    </p>
                  </div>
                )}
                {movie.revenue && Number(movie.revenue) > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Revenue
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("us-EN", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(Number(movie.revenue))}
                    </p>
                  </div>
                )}
                {movie.homepage && (
                  <div className="col-span-2">
                    <a
                      href={movie.homepage}
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
        {Array.isArray(movie.cast) && movie.cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Casting Principal
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.slice(0, 12).map((actor, i) => (
                <div
                  key={actor.id || i}
                  className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                    <Image
                      src={getImageUrl(
                        actor.profilePath || actor.profile_path,
                        "w185"
                      )}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {actor.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(movie.productionCompanies) &&
          movie.productionCompanies.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Production
              </h2>
              <div className="flex flex-wrap gap-6">
                {movie.productionCompanies.map((company, idx) => (
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
