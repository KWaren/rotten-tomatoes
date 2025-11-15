import MovieList from "@/components/movie/MovieList";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import AuthenticatedHeader from "@/components/layout/AuthenticatedHeader";

async function getLocalMoviesFromDb() {
  const movies = await prisma.movie.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      ratings: {
        select: {
          score: true,
        },
      },
      favorites: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          ratings: true,
          comments: true,
          favorites: true,
        },
      },
    },
  });

  const normalized = movies.map((m) => {
    const averageRating =
      m.ratings.length > 0
        ? m.ratings.reduce((sum, r) => sum + r.score, 0) / m.ratings.length
        : 0;

    return {
      id: m.id,
      title: m.title,
      original_title: m.originalTitle,
      originalTitle: m.originalTitle,
      posterUrl: m.posterUrl,
      backdropUrl: m.backdropUrl,
      poster_path: null,
      backdrop_path: null,
      releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
      averageRating: parseFloat(averageRating.toFixed(1)),
      voteAverage: parseFloat(averageRating.toFixed(1)),
      vote_average: parseFloat(averageRating.toFixed(1)),
      voteCount: m._count.ratings,
      vote_count: m._count.ratings,
      genres: m.genres || [],
      _count: m._count,
      ratings: m.ratings,
      favorites: m.favorites,
    };
  });

  return { movies: normalized, total: normalized.length };
}

export default async function Home() {
  try {
    const cookieName = process.env.COOKIE_NAME || "sid";
    const cookieStore = await cookies();
    const sid = cookieStore.get(cookieName)?.value;
    const user = sid ? verifyToken(sid) : null;
    if (!user) {
      redirect("/about");
    }
  } catch (err) {
    redirect("/about");
  }

  const { movies } = await getLocalMoviesFromDb();

  // Popular Movies: sorted by number of favorites (most popular)
  const popularMovies = [...movies]
    .sort((a, b) => (b._count?.favorites || 0) - (a._count?.favorites || 0))
    .slice(0, 12);

  // Top Rated: sorted by average rating (highest rated with minimum 1 rating)
  const topRatedMovies = [...movies]
    .filter((m) => m._count.ratings >= 1) // At least 1 rating
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader />

      <main className="container mx-auto px-4 py-12 space-y-16 min-h-screen">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                />
              </svg>
              Popular Movies
            </h2>
            <Link
              href="/movies"
              className="text-red-600 hover:text-red-700 font-medium text-sm md:text-base"
            >
              See more
            </Link>
          </div>
          <MovieList movies={popularMovies} variant="user" basePath="/movies" />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-yellow-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
              Top Rated
            </h2>
            <Link
              href="/movies?sort=top_rated"
              className="text-red-600 hover:text-red-700 font-medium text-sm md:text-base"
            >
              See more
            </Link>
          </div>
          <MovieList
            movies={topRatedMovies}
            variant="user"
            basePath="/movies"
          />
        </section>
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
