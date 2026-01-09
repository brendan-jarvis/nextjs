"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GameProvider, useGameState } from "./hooks/useGameState";
import { GameScene } from "./game/GameScene";
import { StartScreen } from "./ui/StartScreen";
import { GameOverScreen } from "./ui/GameOverScreen";
import { HUD } from "./ui/HUD";

function MobileWarning() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black p-8 text-center font-[family-name:var(--font-press-start)]">
      <h1 className="mb-8 text-2xl text-white">ASTEROIDS</h1>
      <p className="mb-4 text-sm text-gray-400">
        This game requires a keyboard to play.
      </p>
      <p className="text-sm text-gray-400">
        Please visit on a desktop computer.
      </p>
    </div>
  );
}

function GameContent() {
  const { state } = useGameState();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice && isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="relative h-full w-full">
      <Canvas
        orthographic
        camera={{ zoom: 7, position: [0, 0, 100] }}
        style={{ background: "black" }}
      >
        <GameScene />
      </Canvas>

      {state.phase === "start" && <StartScreen />}
      {state.phase === "gameOver" && <GameOverScreen />}
      {state.phase === "playing" && <HUD />}
    </div>
  );
}

export default function AsteroidsGame() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
