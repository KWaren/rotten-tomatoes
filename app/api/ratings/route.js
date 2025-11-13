import { NextResponse } from "next/server";
import {
  getRatings,
  getRatingsByMovie,
  createRating,
  getRatingByUserMovie,
} from "@/lib/ratings";

// GET /api/ratings?movieId=123
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (movieId) {
      const ratings = await getRatingsByMovie(movieId);
      return NextResponse.json({ data: ratings });
    }

    const ratings = await getRatings();
    return NextResponse.json({ data: ratings });
  } catch (error) {
    console.error("GET /api/ratings error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}

// POST /api/ratings
// body: { userId, movieId, score }
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, movieId, score } = body || {};

    if (userId == null || movieId == null || score == null) {
      return NextResponse.json({ error: "userId, movieId and score are required" }, { status: 400 });
    }

    // If user already rated this movie, return existing or update? We'll create new for now.
    const existing = await getRatingByUserMovie(userId, movieId);
    if (existing) {
      // return existing with 200
      return NextResponse.json({ data: existing });
    }

    const created = await createRating({ userId, movieId, score });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/ratings error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
