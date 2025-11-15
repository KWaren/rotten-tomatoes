"use client";

import React, { useState } from "react";
import Star from "./Star";

export default function Stars({ count = 10, value = 0, onPick = () => {}, disabled = false }) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHoverValue(0)}
    >
      {Array.from({ length: count }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= (hoverValue || value);
        return (
          <Star
            key={idx}
            filled={filled}
            onClick={() => onPick(idx)}
            onMouseEnter={() => setHoverValue(idx)}
            title={`${idx} / ${count}`}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}
