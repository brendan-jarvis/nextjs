"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group } from "three";

interface ExplosionProps {
  position: { x: number; y: number };
  size: number;
  onComplete: () => void;
  colors?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  angle: number;
  color: string;
}

const DEFAULT_COLORS = ["#ffffff"];
const FLAME_COLORS = ["#ff4400", "#ff6600", "#ff8800", "#ffaa00", "#ffcc00", "#ffff00"];

function createParticles(size: number, colors: string[]): Particle[] {
  const particles: Particle[] = [];
  const count = Math.floor(6 + size * 2);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const speed = 8 + Math.random() * 12;
    particles.push({
      x: 0,
      y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 0.5 + Math.random() * size * 0.5,
      angle: angle,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#ffffff",
    });
  }
  return particles;
}

export { FLAME_COLORS };

export function Explosion({ position, size, onComplete, colors = DEFAULT_COLORS }: ExplosionProps) {
  const groupRef = useRef<Group>(null);
  const particlesRef = useRef<Particle[] | null>(null);
  const lifetimeRef = useRef(1.0);
  const colorsRef = useRef(colors);

  // Initialize particles once
  if (particlesRef.current === null) {
    particlesRef.current = createParticles(size, colorsRef.current);
  }

  useFrame((_, delta) => {
    if (!groupRef.current || !particlesRef.current) return;

    lifetimeRef.current -= delta * 2;

    if (lifetimeRef.current <= 0) {
      onComplete();
      return;
    }

    // Update particle positions
    for (const p of particlesRef.current) {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      // Slow down
      p.vx *= 0.98;
      p.vy *= 0.98;
    }
  });

  const opacity = Math.max(0, lifetimeRef.current);
  const particles = particlesRef.current || [];

  return (
    <group ref={groupRef} position={[position.x, position.y, 0]}>
      {particles.map((p, i) => {
        const endX = p.x + Math.cos(p.angle) * p.length;
        const endY = p.y + Math.sin(p.angle) * p.length;
        return (
          <Line
            key={i}
            points={[
              [p.x, p.y, 0],
              [endX, endY, 0],
            ]}
            color={p.color}
            lineWidth={1.5}
            transparent
            opacity={opacity}
          />
        );
      })}
    </group>
  );
}
