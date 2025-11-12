// Fonctions used to manipulate Comments in the Database

export async function createComment(userId, movieId, content) {
  try {
    const newComment = await prisma.comment.create({
      data: {
        userId: userId,
        movieId: movieId,
        comment: content,
      },
      include: {
        user: { select: { name: true, surname: true } },
        movie: { select: { title: true } },
      },
    });
    console.log(`Commentaire créé : "${newComment.comment}" par ${newComment.user.name} sur le film "${newComment.movie.title}".`);
    return newComment;
  } catch (error) {
    console.error("Erreur lors de la création du commentaire :", error);
    throw error;
  }
}


export async function getCommentById(commentId) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: { select: { name: true, email: true } },
      movie: { select: { title: true, average: true } },
    },
  });
  
  if (!comment) {
    console.log(`Commentaire avec ID ${commentId} non trouvé.`);
  }
  return comment;
}


export async function getCommentsByMovie(movieId) {
  const comments = await prisma.comment.findMany({
    where: { movieId: movieId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, surname: true } },
    },
  });
  return comments;
}


export async function updateComment(commentId, data) {
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: data,
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
      where: { id: commentId },
    });
    console.log(`Commentaire ID ${commentId} supprimé avec succès.`);
    return true;
  } catch (error) {
    // P.ex. si l'ID n'existe pas, Prisma génère une erreur P2025
    console.error(`Erreur lors de la suppression du commentaire ID ${commentId}:`, error);
    throw error;
  }
}