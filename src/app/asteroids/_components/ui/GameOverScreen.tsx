"use client";

import { useEffect } from "react";
import { useGameActions, useGameState } from "../hooks/useGameState";

export function GameOverScreen() {
  const { restartGame } = useGameActions();
  const { state } = useGameState();

  const isNewHighScore = state.score >= state.highScore && state.score > 0;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        restartGame();
      }
    };

    // Add a small delay before listening to prevent accidental restart
    const timer = setTimeout(() => {
      window.addEventListener("keydown", handleKeyPress);
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [restartGame]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
      <h1 className="mb-6 font-[family-name:var(--font-press-start)] text-3xl text-red-500 md:text-4xl">
        GAME OVER
      </h1>

      <div className="mb-4 font-[family-name:var(--font-press-start)] text-xl text-white md:text-2xl">
        SCORE: {state.score.toString().padStart(6, "0")}
      </div>

      {isNewHighScore ? (
        <div className="mb-4 animate-pulse font-[family-name:var(--font-press-start)] text-lg text-yellow-400">
          NEW HIGH SCORE!
        </div>
      ) : (
        <div className="mb-4 font-[family-name:var(--font-press-start)] text-sm text-gray-400">
          HIGH SCORE: {state.highScore.toString().padStart(6, "0")}
        </div>
      )}

      <div className="mb-2 font-[family-name:var(--font-press-start)] text-sm text-gray-400">
        LEVEL: {state.level}
      </div>

      <p className="mt-8 animate-pulse font-[family-name:var(--font-press-start)] text-sm text-white">
        PRESS SPACE TO PLAY AGAIN
      </p>
    </div>
  );
}
