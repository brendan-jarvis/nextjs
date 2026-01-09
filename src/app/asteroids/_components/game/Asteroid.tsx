"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Shape, ShapeGeometry } from "three";
import type { Group } from "three";
import type { AsteroidData } from "../types/game";

interface AsteroidProps {
  data: AsteroidData;
  onPositionUpdate: (id: string, x: number, y: number) => void;
}

// Seeded random number generator for consistent asteroid shapes
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate classic asteroid outline points
function createAsteroidPoints(radius: number, seed: number): [number, number, number][] {
  const random = seededRandom(seed);
  const segments = 9 + Math.floor(random() * 4); // 9-12 sides
  const points: [number, number, number][] = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Classic asteroids had jagged, rocky shapes
    const variation = 0.65 + random() * 0.45;
    const r = radius * variation;
    points.push([Math.cos(angle) * r, Math.sin(angle) * r, 0]);
  }

  // Close the shape
  points.push(points[0]);

  return points;
}

// Create a filled shape geometry from points
function createFillGeometry(points: [number, number, number][]): ShapeGeometry {
  const shape = new Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  return new ShapeGeometry(shape);
}

export function Asteroid({ data, onPositionUpdate }: AsteroidProps) {
  const meshRef = useRef<Group>(null);

  // Create a seed from the asteroid ID for consistent random shape
  const seed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < data.id.length; i++) {
      hash = ((hash << 5) - hash) + data.id.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }, [data.id]);

  // Generate classic asteroid outline
  const outlinePoints = useMemo(
    () => createAsteroidPoints(data.radius, seed),
    [data.radius, seed]
  );

  const fillGeometry = useMemo(
    () => createFillGeometry(outlinePoints),
    [outlinePoints]
  );

  // Report position for collision detection
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = data.position.x;
      meshRef.current.position.y = data.position.y;
      meshRef.current.rotation.z = data.rotation;

      onPositionUpdate(data.id, data.position.x, data.position.y);
    }
  });

  return (
    <group ref={meshRef} position={[data.position.x, data.position.y, 0]}>
      {/* Solid black fill to occlude stars */}
      <mesh geometry={fillGeometry}>
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Classic line outline */}
      <Line
        points={outlinePoints}
        color="#ffffff"
        lineWidth={1.5}
      />
    </group>
  );
}
