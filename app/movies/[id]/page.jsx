import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FavoriteButton from "@/components/movie/FavoriteButton";
import CommentSection from "@/components/comments/CommentSection";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import MovieClientPage from "../../../components/movie/MovieClientPage";

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
    const cookieStore = cookies();
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
