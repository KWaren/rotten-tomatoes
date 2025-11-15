"use client";

import { useRef } from "react";
import Image from "next/image";

const getImageUrl = (path, size = "w500") => {
  if (!path) return "/default-Movie-image.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  return `${baseUrl}/${size}${path}`;
};

export default function CastSlider({ cast = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!Array.isArray(cast) || cast.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Casting Principal
        </h2>
      </div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 scroll-snap-type-x-mandatory"
        style={{ scrollbarWidth: "none", "-ms-overflow-style": "none" }}
      >
        {cast.slice(0, 12).map((actor, i) => (
          <div
            key={actor.id || i}
            className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow shrink-0 w-40 scroll-snap-align-start"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
              <Image
                src={getImageUrl(actor.profilePath || actor.profile_path, "w185")}
                alt={actor.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">
              {actor.name}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
              {actor.character}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
