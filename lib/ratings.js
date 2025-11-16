import prisma from "./prisma";

// Fonctions used to manipulate Rate in the Database
export async function getRatings() {
  return await prisma.rating.findMany({
    include: { user: { select: { name: true, surname: true } }, movie: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRatingById(id) {
  return await prisma.rating.findUnique({
    where: { id: Number(id) },
    include: { user: { select: { name: true, surname: true } }, movie: { select: { title: true } } },
  });
}

export async function getRatingsByMovie(movieId) {
  return await prisma.rating.findMany({
    where: { movieId: Number(movieId) },
    include: { user: { select: { name: true, surname: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRatingByUserMovie(userId, movieId) {
  return await prisma.rating.findFirst({ where: { userId: Number(userId), movieId: Number(movieId) } });
}

export async function createRating({ userId, movieId, score }) {
  return await prisma.rating.create({
    data: { userId: Number(userId), movieId: Number(movieId), score: Number(score) },
  });
}

export async function updateRating(id, data) {
  return await prisma.rating.update({ where: { id: Number(id) }, data });
}

export async function deleteRating(id) {
  await prisma.rating.delete({ where: { id: Number(id) } });
  return true;
}
