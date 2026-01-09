"use client";

import { useEffect } from "react";
import { useGameActions, useGameState } from "../hooks/useGameState";

export function StartScreen() {
  const { startGame } = useGameActions();
  const { state } = useGameState();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [startGame]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
      <h1 className="mb-8 font-[family-name:var(--font-press-start)] text-4xl text-white md:text-6xl">
        ASTEROIDS
      </h1>

      <p className="animate-pulse font-[family-name:var(--font-press-start)] text-lg text-white md:text-xl">
        PRESS SPACE TO START
      </p>

      <div className="mt-12 space-y-2 font-[family-name:var(--font-press-start)] text-xs text-gray-400 md:text-sm">
        <p>ARROW KEYS / WASD - MOVE & ROTATE</p>
        <p>SPACE - FIRE</p>
      </div>

      {state.highScore > 0 && (
        <div className="mt-8 font-[family-name:var(--font-press-start)] text-sm text-yellow-400">
          HIGH SCORE: {state.highScore.toString().padStart(6, "0")}
        </div>
      )}
    </div>
  );
}
