// Fonctions used to manipulate Comments in the Database
import prisma from "./prisma";

export async function createComment(userId, movieId, content) {
  try {
    const newComment = await prisma.comment.create({
      data: {
        userId: Number(userId),
        movieId: Number(movieId),
        content: content,
      },
      include: {
        user: { select: { name: true} },
        movie: { select: { title: true } },
      },
    });
    console.log(`Commentaire créé : "${newComment.content}" par ${newComment.user.name} sur le film "${newComment.movie.title}".`);
    return newComment;
  } catch (error) {
    console.error("Erreur lors de la création du commentaire :", error);
    throw error;
  }
}


export async function getCommentById(commentId) {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    include: {
      user: { select: { name: true, email: true } },
      // movie: { select: { title: true, average: true } },
    },
  });
  
  if (!comment) {
    console.log(`Commentaire avec ID ${commentId} non trouvé.`);
  }
  return comment;
}


export async function getCommentsByMovie(movieId) {
  const comments = await prisma.comment.findMany({
    where: { movieId: Number(movieId) },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
  });
  return comments;
}


export async function getCommentsByUser(userId) {
  const comments = await prisma.comment.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' },
    include: {
      movie: { select: { title: true, description: true, posterUrl:true } },
    },
  });
  return comments;
}


export async function updateComment(commentId, data) {
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: data,
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    console.log(`Commentaire ID ${commentId} mis à jour.`);
    return updatedComment;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du commentaire ID ${commentId}:`, error);
    throw error;
  }
}


export async function deleteComment(commentId) {
  try {
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    console.log(`Commentaire ID ${commentId} supprimé avec succès.`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du commentaire ID ${commentId}:`, error);
    throw error;
  }
}