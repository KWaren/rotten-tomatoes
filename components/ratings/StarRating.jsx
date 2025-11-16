"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Stars from "./Stars";
import RatingModal from "./RatingModal";

export default function StarRating({ movieId }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [average, setAverage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRatings = useCallback(async () => {
    if (!movieId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ratings?movieId=${encodeURIComponent(movieId)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      const list = json.data || [];
      setRatings(list);
      const avg = list.length
        ? list.reduce((s, it) => s + Number(it.score), 0) / list.length
        : 0;
      setAverage(avg);
      if (user) {
        const ur = list.find((it) => String(it.userId) === String(user.id));
        if (ur) setUserRating({ id: ur.id, score: Number(ur.score) });
        else setUserRating(null);
      }
    } catch (e) {
      console.error("Failed to load ratings", e);
    } finally {
      setLoading(false);
    }
  }, [movieId, user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleRatingSubmitted = () => {
    fetchRatings();
    // Emit custom event to notify MovieClientPage
    window.dispatchEvent(new Event("ratingUpdated"));
  };

  const openModal = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Stars count={1} value={average > 0 ? 1 : 0} disabled={true} />
        </div>
        <div className="text-lg">
          <span className="font-bold">{average}</span>
          <span className="text-gray-500">/10</span>
        </div>
        <button
          onClick={openModal}
          className="ml-4 px-4 py-2 borde-none bg-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {userRating ? "Update your rate" : "Rate"}
        </button>
      </div>

      {isModalOpen && (
        <RatingModal
          movieId={movieId}
          userRating={userRating}
          onClose={() => setIsModalOpen(false)}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
}
