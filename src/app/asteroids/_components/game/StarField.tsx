"use client";

import { useMemo } from "react";
import { CanvasTexture } from "three";
import { GAME_CONFIG } from "../constants/gameConfig";

// Realistic star colors based on stellar classification
const STAR_COLORS = [
  { color: [170, 191, 255], weight: 3 },   // Blue-white (hot, rare)
  { color: [202, 216, 255], weight: 5 },   // White-blue
  { color: [255, 255, 255], weight: 15 },  // White (common)
  { color: [255, 244, 232], weight: 20 },  // Yellow-white (most common)
  { color: [255, 210, 161], weight: 12 },  // Orange
  { color: [255, 204, 111], weight: 8 },   // Yellow-orange
  { color: [255, 173, 96], weight: 5 },    // Light orange-red
  { color: [255, 138, 96], weight: 2 },    // Red-orange (cool, rare)
];

function getRandomStarColor(): [number, number, number] {
  const totalWeight = STAR_COLORS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;

  for (const star of STAR_COLORS) {
    random -= star.weight;
    if (random <= 0) {
      return star.color as [number, number, number];
    }
  }
  return [255, 255, 255];
}

function createStarFieldTexture(): CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);

  // Draw 200 stars
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const starSize = Math.random() * 2 + 0.5;
    const color = getRandomStarColor();
    const opacity = Math.random() * 0.4 + 0.6;

    // Draw glow with radial gradient
    const glowRadius = starSize * 6;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(0.1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.5})`);
    gradient.addColorStop(0.4, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.15})`);
    gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  return texture;
}

export function StarField() {
  const texture = useMemo(() => createStarFieldTexture(), []);
  const { BOUNDS } = GAME_CONFIG;
  const fieldSize = BOUNDS.max - BOUNDS.min;

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[fieldSize, fieldSize]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
