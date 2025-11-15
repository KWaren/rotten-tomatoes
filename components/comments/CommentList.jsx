"use client";

import React from "react";
import CommentCard from "./CommentCard";

export default function CommentList({ comments, loading, error, currentUserId, onDelete, onEdit }) {
  if (loading) return <p className="text-gray-600 dark:text-gray-300">Loading comments...</p>;
  if (error) return <p className="text-red-600">{String(error)}</p>;
  if (!comments || comments.length === 0) return <p className="text-gray-600 dark:text-gray-300">No comments yet.</p>;

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <CommentCard
          key={c.id}
          comment={c}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
