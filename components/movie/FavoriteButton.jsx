"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function FavoriteButton({
  movieId,
  initialIsFavorite = false,
  initialFavorites = [],
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await fetch("/api/me", { cache: "no-store" });
        const meJson = await meRes.json();
        const user = meJson?.user;
        if (!user) return;
        const found = Array.isArray(initialFavorites)
          ? initialFavorites.some((f) => f.userId === user.id)
          : false;
        setIsFavorite(found);
      } catch (e) {}
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/me", { cache: "no-store" });
      const meJson = await meRes.json();
      const user = meJson?.user;

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, movieId }),
      });

      if (!res.ok) {
        console.error("Failed to toggle favorite", await res.text());
      } else {
        const json = await res.json();
        if (typeof json.isFavorite === "boolean") {
          setIsFavorite(json.isFavorite);
        } else if (json.isFavorite === undefined) {
          setIsFavorite((s) => !s);
        }
        // Emit custom event to notify favorites page
        window.dispatchEvent(new Event("favoriteUpdated"));
      }
    } catch (err) {
      console.error("Favorite toggle error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isFavorite
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-100 text-gray-900 hover:bg-red-500 dark:bg-gray-700 dark:text-white hover:cursor-pointer"
        }`}
      >
        {isFavorite ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.657 3.172 10.828a4 4 0 010-5.656z" />
            </svg>
            Remove favorite
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.657 3.172 10.828a4 4 0 010-5.656z"
              />
            </svg>
            Add to favorite
          </>
        )}
      </button>
    </div>
  );
}
