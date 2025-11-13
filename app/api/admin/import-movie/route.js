import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
  datasourceUrl: process.env.ACCELERATE_URL,
}).$extends(withAccelerate());

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL =
  process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";

export async function POST(request) {
  try {
    const { tmdbId } = await request.json();

    if (!tmdbId) {
      return NextResponse.json({ error: "TMDB ID requis" }, { status: 400 });
    }

    if (!TMDB_API_KEY) {
      console.error("TMDB_API_KEY n'est pas définie dans .env");
      return NextResponse.json(
        { error: "Configuration API manquante" },
        { status: 500 }
      );
    }

    const movieResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=fr-FR`,
      {
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!movieResponse.ok) {
      const errorText = await movieResponse.text();
      console.error("Error TMDB API:", errorText);
      return NextResponse.json(
        { error: "Movie not found on TMDB" },
        { status: 404 }
      );
    }

    const movieData = await movieResponse.json();

    const existingMovie = await prisma.movie.findUnique({
      where: { tmdbId: Number(tmdbId) },
    });

    if (existingMovie) {
      return NextResponse.json(
        { error: "Movie already imported" },
        { status: 400 }
      );
    }

    const creditsResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`,
      {
        signal: AbortSignal.timeout(10000),
      }
    );
    const creditsData = await creditsResponse.json();

    const director = creditsData.crew?.find(
      (person) => person.job === "Director"
    );

    const cast =
      creditsData.cast?.slice(0, 10).map((actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path,
      })) || [];

    const crew =
      creditsData.crew
        ?.filter((person) =>
          [
            "Director",
            "Producer",
            "Executive Producer",
            "Screenplay",
            "Writer",
          ].includes(person.job)
        )
        .map((person) => ({
          id: person.id,
          name: person.name,
          job: person.job,
          department: person.department,
        })) || [];

    const newMovie = await prisma.movie.create({
      data: {
        tmdbId: Number(tmdbId),
        title: movieData.title,
        originalTitle: movieData.original_title,
        description: movieData.overview || "Aucune description disponible",
        tagline: movieData.tagline || null,
        posterUrl: movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
          : null,
        backdropUrl: movieData.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
          : null,
        releaseDate: movieData.release_date
          ? new Date(movieData.release_date)
          : null,
        director: director?.name || "Inconnu",
        genres: movieData.genres?.map((g) => g.name) || [],
        runtime: movieData.runtime || null,
        status: movieData.status || null,
        voteAverage: movieData.vote_average || null,
        voteCount: movieData.vote_count || null,
        budget: movieData.budget ? BigInt(movieData.budget) : null,
        revenue: movieData.revenue ? BigInt(movieData.revenue) : null,
        homepage: movieData.homepage || null,
        originalLanguage: movieData.original_language || null,
        cast: cast,
        crew: crew,
      },
    });

    const serializedMovie = {
      ...newMovie,
      budget: newMovie.budget ? newMovie.budget.toString() : null,
      revenue: newMovie.revenue ? newMovie.revenue.toString() : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Movie imported",
        movie: serializedMovie,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while importing:", error);

    if (error.name === "AbortError" || error.code === "ETIMEDOUT") {
      return NextResponse.json(
        {
          error: "Timeout exceeded. Check your internet connection.",
        },
        { status: 504 }
      );
    }

    if (error.cause?.code === "ENOTFOUND") {
      return NextResponse.json(
        {
          error:
            "Unable to contact TMDB API. Check your connection.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Error while importing: ${error.message}` },
      { status: 500 }
    );
  }
}
