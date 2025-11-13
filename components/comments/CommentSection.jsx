"use client";
import React from "react";

export default function CommentSection({ movieId }) {
  return (
    <section id="comments-section" className="mt-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Comments
        </h2>
        <div className="text-gray-600 dark:text-gray-300">
          {/* Gil, c'est ici que tu taf */}
        </div>
      </div>
    </section>
  );
}
