import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
  datasourceUrl: process.env.ACCELERATE_URL,
}).$extends(withAccelerate());

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const genre = searchParams.get("genre");

    const skip = (page - 1) * limit;

    const where = genre ? { genres: { has: genre } } : {};

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: limit,
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
      }),
      prisma.movie.count({ where }),
    ]);

    const serializedMovies = movies.map((movie) => {
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
    });

    return NextResponse.json({
      movies: serializedMovies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[API] Error fetching movies:", error);
    return NextResponse.json(
      { error: "Error while fetching movies" },
      { status: 500 }
    );
  }
}
