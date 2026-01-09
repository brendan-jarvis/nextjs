"use client";

import { useGameState } from "../hooks/useGameState";

function ShipIcon() {
  return (
    <svg
      viewBox="0 0 20 24"
      className="h-5 w-4 fill-none stroke-white stroke-2"
    >
      <path d="M10 2 L2 22 L10 18 L18 22 Z" />
    </svg>
  );
}

export function HUD() {
  const { state } = useGameState();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 font-[family-name:var(--font-press-start)]">
      <div className="space-y-1">
        <div className="text-lg text-white md:text-xl">
          {state.score.toString().padStart(6, "0")}
        </div>
        <div className="text-lg text-yellow-400 md:text-xl">
          {state.highScore.toString().padStart(6, "0")}
        </div>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: state.lives }).map((_, i) => (
          <ShipIcon key={i} />
        ))}
      </div>
    </div>
  );
}
