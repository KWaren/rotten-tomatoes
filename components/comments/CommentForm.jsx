"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function CommentForm({ movieId, onPosted }) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session) {
      signIn();
      return;
    }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, movieId, content: newComment.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to post comment");
      setNewComment("");
      if (onPosted) onPosted(json.data);
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-6">
      <div>
        {!session ? (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            You must be signed in to post comments.{' '}
            <button className="text-red-600 underline cursor-pointer" onClick={() => signIn()}>
              Sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              className="w-full border-none outline-none rounded p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              disabled={submitting}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
