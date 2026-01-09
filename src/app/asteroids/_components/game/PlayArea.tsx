"use client";

import { Line } from "@react-three/drei";
import { GAME_CONFIG } from "../constants/gameConfig";

export function PlayArea() {
  const { BOUNDS } = GAME_CONFIG;
  const min = BOUNDS.min;
  const max = BOUNDS.max;

  const points: [number, number, number][] = [
    [min, min, 0],
    [max, min, 0],
    [max, max, 0],
    [min, max, 0],
    [min, min, 0],
  ];

  return (
    <Line
      points={points}
      color="#333333"
      lineWidth={1}
    />
  );
}
