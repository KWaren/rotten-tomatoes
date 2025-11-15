"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import StarRating from "@/components/ratings/StarRating";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function CommentSection({ movieId }) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    let mounted = true;
    setLoading(true);
    fetch(`/api/comments?movieId=${encodeURIComponent(movieId)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (json.error) {
          setError(json.error);
          setComments([]);
        } else {
          setComments(json.data || []);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load comments");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [movieId]);

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete comment");
      setComments((s) => s.filter((c) => String(c.id) !== String(id)));
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete comment");
    }
  }

  async function handleEdit(id, newText) {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update comment");
      setComments((s) =>
        s.map((c) => (String(c.id) === String(id) ? json.data : c))
      );
    } catch (err) {
      console.error("Edit error:", err);
      setError(err.message || "Failed to update comment");
      throw err;
    }
  }

  function handlePosted(newComment) {
    setComments((s) => [newComment, ...s]);
  }

  return (
    <section id="comments-section" className="mt-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          𓂃˖˳·˖ ִֶָ ⋆ ִֶָ Comments ִֶָ⋆ ִֶָ˖·˳˖𓂃
        </h2>

        <div className="flex items-center mb-4 gap-2">
          <div className="bg-red-600 text-red-600 rounded w-2 h-10">.</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Your current Rate
          </h2>
        </div>
        <div className="mb-6">
          <StarRating movieId={movieId} />
          <CommentForm movieId={movieId} onPosted={handlePosted} />
        </div>

        <div>
          <CommentList
            comments={comments}
            loading={loading}
            error={error}
            currentUserId={user?.id}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </section>
  );
}
