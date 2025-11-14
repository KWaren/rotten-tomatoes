"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Stars from "./Stars";
import Star from "./Star";

export default function RatingModal({
  movieId,
  userRating,
  onClose,
  onRatingSubmitted,
}) {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [selectedScore, setSelectedScore] = useState(
    userRating ? userRating.score : 0
  );

  const handlePick = (score) => {
    setSelectedScore(score);
  };

  const handleSubmit = async () => {
    if (!session) {
      signIn();
      return;
    }
    if (!movieId || !selectedScore) return;
    if (submitting) return;

    setSubmitting(true);
    try {
      let res, json;
      if (userRating && userRating.id) {
        res = await fetch(`/api/ratings/${userRating.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: selectedScore }),
        });
      } else {
        res = await fetch(`/api/ratings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            movieId,
            score: selectedScore,
          }),
        });
      }
      json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit rating");

      onRatingSubmitted();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md">
        <div className="flex justify-center text-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Rate this movie
        </h2>
        <div className="flex justify-center my-4">
          <Stars
            count={10}
            value={selectedScore}
            onPick={handlePick}
            disabled={submitting}
          />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
            disabled={!selectedScore || submitting}
          >
            {submitting ? "Save..." : "Rate"}
          </button>
        </div>
      </div>
    </div>
  );
}
