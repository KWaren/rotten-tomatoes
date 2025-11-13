import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
  datasourceUrl: process.env.ACCELERATE_URL,
}).$extends(withAccelerate());

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const movieId = parseInt(id, 10);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    if (!movie) {
      return NextResponse.json({ error: "Film introuvable" }, { status: 404 });
    }

    const averageRating =
      movie.ratings.length > 0
        ? movie.ratings.reduce((sum, r) => sum + r.score, 0) /
          movie.ratings.length
        : 0;

    const serializedMovie = {
      ...movie,
      budget: movie.budget ? movie.budget.toString() : null,
      revenue: movie.revenue ? movie.revenue.toString() : null,
      averageRating: parseFloat(averageRating.toFixed(1)),
    };

    return NextResponse.json(serializedMovie);
  } catch (error) {
    console.error("[API] Error fetching movie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du film" },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const movieId = parseInt(id, 10);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { movieId },
    });
    await prisma.comment.deleteMany({
      where: { movieId },
    });
    await prisma.rating.deleteMany({
      where: { movieId },
    });

    await prisma.movie.delete({
      where: { id: movieId },
    });

    return NextResponse.json({ message: "Film supprimé" }, { status: 200 });
  } catch (error) {
    console.error("[API] Error deleting movie:", error);
    return NextResponse.json(
      { error: "Error while deleting movie" },
      { status: 500 }
    );
  }
}
