import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const getImageUrl = (url) => {
  if (!url) return "/default-Movie-image.jpg";
  return url;
};

async function getMovieFromDB(id) {
  const res = await fetch(`http://localhost:3000/api/movies/${id}`, {
    cache: "no-store",
  });
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
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-red-600">
            My Rotten Tomatoes
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/movies"
          className="text-red-600 hover:underline mb-4 inline-block"
        >
          Back to Movies
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={getImageUrl(movie.posterUrl)}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-yellow-600 text-xl">
                Rating:{" "}
                {movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"}
              </span>
              <span className="text-gray-600">
                ({movie._count?.ratings || 0} votes)
              </span>
              <span className="text-gray-700">{releaseYear}</span>
            </div>
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-4">
                <span className="px-4 py-2 bg-red-600 text-white rounded-full text-sm">
                  {movie.genres[0]}
                </span>
              </div>
            )}
            {movie.director && (
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Director:</span>{" "}
                {movie.director}
              </p>
            )}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Synopsis
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.description || "No description available."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Comments</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {movie._count?.comments || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {movie._count?.favorites || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
