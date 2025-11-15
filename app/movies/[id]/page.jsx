import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import MovieClientPage from "../../../components/movie/MovieClientPage";

async function getMovieFromDB(id) {
  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      ratings: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      comments: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      favorites: {
        select: { userId: true },
      },
      _count: {
        select: { ratings: true, comments: true, favorites: true },
      },
    },
  });

  if (!movie) return null;

  const averageRating =
    movie.ratings.length > 0
      ? movie.ratings.reduce((sum, r) => sum + r.score, 0) /
        movie.ratings.length
      : 0;

  return {
    ...movie,
    budget: movie.budget ? movie.budget.toString() : null,
    revenue: movie.revenue ? movie.revenue.toString() : null,
    averageRating: parseFloat(averageRating.toFixed(1)),
  };
}

export default async function Page({ params }) {
  try {
    const cookieName = process.env.COOKIE_NAME || "sid";
    const cookieStore = await cookies();
    const sid = cookieStore.get(cookieName)?.value;
    const user = sid ? verifyToken(sid) : null;
    if (!user) {
      redirect("/login");
    }
  } catch (err) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;
  const movie = await getMovieFromDB(id);

  if (!movie) notFound();

  return <MovieClientPage movie={movie} />;
}
