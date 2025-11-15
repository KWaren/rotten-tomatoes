import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      select: {
        director: true,
      },
      where: {
        director: {
          not: null,
        },
      },
    });

    const directors = [
      ...new Set(movies.map((m) => m.director).filter(Boolean)),
    ].sort();

    return NextResponse.json({ directors });
  } catch (error) {
    console.error("Error fetching directors:", error);
    return NextResponse.json(
      { error: "Failed to fetch directors" },
      { status: 500 }
    );
  }
}
