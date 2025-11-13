import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction pour calculer l'âge à partir de la date de naissance (format String)
function calculateAge(birthdayString) {
  if (!birthdayString) return null;
  try {
    const birthDate = new Date(birthdayString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch {
    return null;
  }
}

// Fonction pour déterminer la tranche d'âge
function getAgeGroup(age) {
  if (age === null) return "Unknown";
  if (age < 18) return "Under 18";
  if (age < 26) return "18-25";
  if (age < 36) return "26-35";
  if (age < 46) return "36-45";
  if (age < 56) return "46-55";
  return "55+";
}

export async function GET(request) {
  try {
    // Nombre d'utilisateurs vérifiés
    const verifiedUsersCount = await prisma.user.count({
      where: { verified: true },
    });

    // Nombre total de comptes créés
    const totalAccountsCount = await prisma.user.count();

    // Nombre de films disponibles sur la plateforme
    const totalMoviesCount = await prisma.movie.count();

    // Genres les plus populaires (genre avec meilleure moyenne de notes)
    const moviesWithRatings = await prisma.movie.findMany({
      include: {
        ratings: {
          select: { score: true },
        },
      },
    });

    const genreStats = {};
    moviesWithRatings.forEach((movie) => {
      if (!genreStats[movie.genre]) {
        genreStats[movie.genre] = { totalScore: 0, count: 0, movies: 0 };
      }
      genreStats[movie.genre].movies += 1;
      if (movie.ratings.length > 0) {
        const avgScore =
          movie.ratings.reduce((sum, r) => sum + r.score, 0) / movie.ratings.length;
        genreStats[movie.genre].totalScore += avgScore;
        genreStats[movie.genre].count += 1;
      }
    });

    const genresPopular = Object.entries(genreStats)
      .map(([genre, stats]) => ({
        genre,
        avgRating: stats.count > 0 ? (stats.totalScore / stats.count).toFixed(2) : 0,
        movieCount: stats.movies,
      }))
      .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating));

    // Films populaires par tranche d'âge
    // Récupérer tous les utilisateurs avec leur anniversaire et leurs notes
    const usersWithRatings = await prisma.user.findMany({
      include: {
        ratings: {
          include: {
            movie: {
              select: { id: true, title: true, genre: true, posterUrl: true },
            },
          },
        },
      },
    });

    // Construire un objet avec films groupés par tranche d'âge
    const moviesByAgeGroup = {};

    usersWithRatings.forEach((user) => {
      const age = calculateAge(user.birthday);
      const ageGroup = getAgeGroup(age);

      if (!moviesByAgeGroup[ageGroup]) {
        moviesByAgeGroup[ageGroup] = {};
      }

      user.ratings.forEach((rating) => {
        const movieId = rating.movie.id;
        if (!moviesByAgeGroup[ageGroup][movieId]) {
          moviesByAgeGroup[ageGroup][movieId] = {
            id: movieId,
            title: rating.movie.title,
            genre: rating.movie.genre,
            posterUrl: rating.movie.posterUrl,
            scores: [],
          };
        }
        moviesByAgeGroup[ageGroup][movieId].scores.push(rating.score);
      });
    });

    // Calculer les moyennes et trier par note moyenne décroissante
    const popularMoviesByAgeGroup = {};
    Object.entries(moviesByAgeGroup).forEach(([ageGroup, movies]) => {
      popularMoviesByAgeGroup[ageGroup] = Object.values(movies)
        .map((movie) => ({
          ...movie,
          avgRating: (
            movie.scores.reduce((a, b) => a + b, 0) / movie.scores.length
          ).toFixed(2),
          ratingCount: movie.scores.length,
          scores: undefined, // ne pas retourner les scores individuels
        }))
        .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating))
        .slice(0, 5); // Top 5 par groupe d'âge
    });

    // Retourner tous les KPIs
    return NextResponse.json({
      verifiedUsersCount,
      totalAccountsCount,
      totalMoviesCount,
      genresPopular,
      moviesByAgeGroup: popularMoviesByAgeGroup,
    });
  } catch (error) {
    console.error("GET /api/kpis error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
