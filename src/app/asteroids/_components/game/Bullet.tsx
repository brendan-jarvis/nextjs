"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { BulletData } from "../types/game";
import { GAME_CONFIG } from "../constants/gameConfig";

interface BulletProps {
  data: BulletData;
  onPositionUpdate: (id: string, x: number, y: number) => void;
}

export function Bullet({ data, onPositionUpdate }: BulletProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = data.position.x;
      meshRef.current.position.y = data.position.y;

      onPositionUpdate(data.id, data.position.x, data.position.y);
    }
  });

  return (
    <mesh ref={meshRef} position={[data.position.x, data.position.y, 0]}>
      <circleGeometry args={[GAME_CONFIG.BULLET_RADIUS, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}
