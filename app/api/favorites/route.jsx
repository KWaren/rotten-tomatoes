import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


// Ajouter ou retirer un film des favoris
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, movieId } = body;

    // Validation des champs requis
    // Note: le modèle Prisma Favorite ne contient que userId et movieId
    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "Missing required fields: userId, movieId" },
        { status: 400 }
      );
    }

    // Vérifier si le film est déjà dans les favoris
    const existing = await prisma.favorite.findFirst({
      where: { userId, movieId },
    });

    if (existing) {
      // Si oui, on le supprime (toggle off)
      const result = await prisma.favorite.deleteMany({ where: { userId, movieId } });
      return NextResponse.json({
        message: "Removed from favorites",
        isFavorite: false,
        deletedCount: result.count,
      });
    }

    // Sinon, on le crée (toggle on)
    const favorite = await prisma.favorite.create({
      data: { userId, movieId },
    });

    return NextResponse.json({
      ...favorite,
      isFavorite: true,
    });
  } catch (error) {
    console.error("POST /favorites error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status : 500 }
    );
  }
}

// // Récupérer les favoris d'un utilisateur
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = parseInt(searchParams.get("userId"));

//     if (!userId || isNaN(userId)) {
//       return NextResponse.json(
//         { error: "Valid userId is required" },
//         { status: 400 }
//       );
//     }

//     const favorites = await prisma.favorite.findMany({
//       where: { userId },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(favorites);
//   } catch (error) {
//     console.error("GET /favorites error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" }, 
//       { status: 500 }
//     );
//   }
// }

// // Supprimer un favori précis à partir de son id
// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = parseInt(searchParams.get("id"));

//     if (!id || isNaN(id)) {
//       return NextResponse.json(
//         { error: "Valid favorite id is required" },
//         { status: 400 }
//       );
//     }

//     await prisma.favorite.delete({ where: { id } });
//     return NextResponse.json({ 
//       message: "Favorite deleted successfully" 
//     });
//   } catch (error) {
//     // Gestion spécifique si le favori n'existe pas
//     if (error.code === 'P2025') {
//       return NextResponse.json(
//         { error: "Favorite not found" },
//         { status: 404 }
//       );
//     }
    
//     console.error("DELETE /favorites error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" }, 
//       { status: 500 }
//     );
//   }
// }