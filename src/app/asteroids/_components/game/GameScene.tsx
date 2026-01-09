"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useCallback, useState } from "react";
import { useGameState, splitAsteroid } from "../hooks/useGameState";
import { StarField } from "./StarField";
import { Ship } from "./Ship";
import { Asteroid } from "./Asteroid";
import { Bullet } from "./Bullet";
import { Explosion, FLAME_COLORS } from "./Explosion";
import { PlayArea } from "./PlayArea";
import { GAME_CONFIG } from "../constants/gameConfig";
import type { AsteroidData, BulletData, TickPayload } from "../types/game";

interface ExplosionData {
  id: string;
  position: { x: number; y: number };
  size: number;
  colors?: string[];
}

function checkCollision(
  pos1: { x: number; y: number },
  radius1: number,
  pos2: { x: number; y: number },
  radius2: number
): boolean {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < radius1 + radius2;
}

function wrapPosition(value: number): number {
  const { BOUNDS } = GAME_CONFIG;
  const range = BOUNDS.max - BOUNDS.min;
  if (value < BOUNDS.min) return value + range;
  if (value > BOUNDS.max) return value - range;
  return value;
}

// Spawn a new large asteroid from outside the play area
function createNewAsteroid(): AsteroidData {
  const { BOUNDS, ASTEROID_SIZES } = GAME_CONFIG;
  const config = ASTEROID_SIZES.large;
  const margin = config.radius + 2; // Spawn just outside the boundary

  let x: number, y: number;
  let velX: number, velY: number;

  // Pick a random edge (0=top, 1=right, 2=bottom, 3=left)
  const edge = Math.floor(Math.random() * 4);
  const posAlongEdge = Math.random() * (BOUNDS.max - BOUNDS.min) + BOUNDS.min;

  switch (edge) {
    case 0: // Top edge - moving downward
      x = posAlongEdge;
      y = BOUNDS.max + margin;
      velX = (Math.random() - 0.5) * config.speed;
      velY = -Math.random() * config.speed - 0.5;
      break;
    case 1: // Right edge - moving left
      x = BOUNDS.max + margin;
      y = posAlongEdge;
      velX = -Math.random() * config.speed - 0.5;
      velY = (Math.random() - 0.5) * config.speed;
      break;
    case 2: // Bottom edge - moving upward
      x = posAlongEdge;
      y = BOUNDS.min - margin;
      velX = (Math.random() - 0.5) * config.speed;
      velY = Math.random() * config.speed + 0.5;
      break;
    default: // Left edge - moving right
      x = BOUNDS.min - margin;
      y = posAlongEdge;
      velX = Math.random() * config.speed + 0.5;
      velY = (Math.random() - 0.5) * config.speed;
      break;
  }

  return {
    id: `asteroid-${Date.now()}-${Math.random()}`,
    position: { x, y },
    velocity: { x: velX, y: velY },
    rotation: Math.random() * Math.PI * 2,
    size: "large",
    radius: config.radius,
  };
}

export function GameScene() {
  const { state, dispatch } = useGameState();
  const shipPositionRef = useRef({ x: 0, y: 0 });
  const shipRotationRef = useRef(0);
  const asteroidsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const bulletsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const collisionCooldowns = useRef<Map<string, number>>(new Map());
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const pendingExplosions = useRef<ExplosionData[]>([]);

  const updateShipPosition = useCallback((x: number, y: number, rotation: number) => {
    shipPositionRef.current = { x, y };
    shipRotationRef.current = rotation;
  }, []);

  const updateAsteroidPosition = useCallback((id: string, x: number, y: number) => {
    asteroidsRef.current.set(id, { x, y });
  }, []);

  const updateBulletPosition = useCallback((id: string, x: number, y: number) => {
    bulletsRef.current.set(id, { x, y });
  }, []);

  // Game loop - collision detection
  useFrame((_, delta) => {
    if (state.phase !== "playing") return;

    // Cap delta to prevent huge jumps
    const dt = Math.min(delta, 0.1);

    // Calculate new asteroid positions
    let updatedAsteroids = state.asteroids.map((asteroid) => {
      const newX = wrapPosition(asteroid.position.x + asteroid.velocity.x * dt);
      const newY = wrapPosition(asteroid.position.y + asteroid.velocity.y * dt);
      return {
        ...asteroid,
        position: { x: newX, y: newY },
        rotation: asteroid.rotation + 0.005,
      };
    });

    // Asteroid-asteroid collisions (mass-based bounce with cooldown)
    const now = Date.now();
    const COLLISION_COOLDOWN = 1000; // ms before same pair can collide again

    // Clean up old cooldowns
    for (const [key, time] of collisionCooldowns.current) {
      if (now - time > COLLISION_COOLDOWN) {
        collisionCooldowns.current.delete(key);
      }
    }

    for (let i = 0; i < updatedAsteroids.length; i++) {
      for (let j = i + 1; j < updatedAsteroids.length; j++) {
        const a1 = updatedAsteroids[i];
        const a2 = updatedAsteroids[j];
        if (!a1 || !a2) continue;

        // Create consistent pair key
        const pairKey = a1.id < a2.id ? `${a1.id}:${a2.id}` : `${a2.id}:${a1.id}`;

        // Skip if on cooldown
        if (collisionCooldowns.current.has(pairKey)) continue;

        const dx = a2.position.x - a1.position.x;
        const dy = a2.position.y - a1.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a1.radius + a2.radius;

        if (dist < minDist && dist > 0.01) {
          // Collision normal
          const nx = dx / dist;
          const ny = dy / dist;

          // Mass based on radius (volume-based: r^3)
          const mass1 = a1.radius * a1.radius * a1.radius;
          const mass2 = a2.radius * a2.radius * a2.radius;
          const totalMass = mass1 + mass2;

          // Separation - push apart enough to clear each other plus buffer
          const overlap = minDist - dist;
          const buffer = Math.max(a1.radius, a2.radius) * 0.5; // Extra buffer based on size
          const sep1 = (overlap / 2 + buffer) * (mass2 / totalMass);
          const sep2 = (overlap / 2 + buffer) * (mass1 / totalMass);

          // Mass-weighted impulse for velocity change (elastic collision)
          const dvn = (a1.velocity.x - a2.velocity.x) * nx + (a1.velocity.y - a2.velocity.y) * ny;
          const impulse = -2 * dvn / totalMass;

          updatedAsteroids[i] = {
            ...a1,
            position: {
              x: a1.position.x - sep1 * nx,
              y: a1.position.y - sep1 * ny,
            },
            velocity: {
              x: a1.velocity.x + impulse * mass2 * nx,
              y: a1.velocity.y + impulse * mass2 * ny,
            },
          };
          updatedAsteroids[j] = {
            ...a2,
            position: {
              x: a2.position.x + sep2 * nx,
              y: a2.position.y + sep2 * ny,
            },
            velocity: {
              x: a2.velocity.x - impulse * mass1 * nx,
              y: a2.velocity.y - impulse * mass1 * ny,
            },
          };

          // Add cooldown for this pair
          collisionCooldowns.current.set(pairKey, now);
        }
      }
    }

    // Calculate new bullet positions and track removed bullets
    let updatedBullets: BulletData[] = [];
    const expiredBulletIds: string[] = [];
    for (const bullet of state.bullets) {
      const newLifetime = bullet.lifetime - 1;
      if (newLifetime <= 0) {
        expiredBulletIds.push(bullet.id);
        continue;
      }

      const newX = wrapPosition(bullet.position.x + bullet.velocity.x * dt);
      const newY = wrapPosition(bullet.position.y + bullet.velocity.y * dt);

      updatedBullets.push({
        ...bullet,
        position: { x: newX, y: newY },
        lifetime: newLifetime,
      });
    }

    // Track score from destroyed asteroids
    let scoreToAdd = 0;

    // Bullet-asteroid collisions
    const bulletsToRemove = new Set<string>();
    const asteroidsToRemove = new Set<string>();
    const newSplitAsteroids: AsteroidData[] = [];
    let largeAsteroidsDestroyed = 0;

    for (const bullet of updatedBullets) {
      for (const asteroid of updatedAsteroids) {
        if (asteroidsToRemove.has(asteroid.id)) continue;

        if (checkCollision(bullet.position, GAME_CONFIG.BULLET_RADIUS * 3, asteroid.position, asteroid.radius)) {
          bulletsToRemove.add(bullet.id);
          asteroidsToRemove.add(asteroid.id);
          scoreToAdd += GAME_CONFIG.ASTEROID_SIZES[asteroid.size].points;

          // Spawn explosion at asteroid position
          pendingExplosions.current.push({
            id: `explosion-${Date.now()}-${Math.random()}`,
            position: { ...asteroid.position },
            size: asteroid.radius,
          });

          // Track large asteroid destruction for respawning
          if (asteroid.size === "large") {
            largeAsteroidsDestroyed++;
          }

          // Split the asteroid
          const splits = splitAsteroid(asteroid);
          newSplitAsteroids.push(...splits);
          break;
        }
      }
    }

    // Apply asteroid destruction
    updatedAsteroids = updatedAsteroids.filter(a => !asteroidsToRemove.has(a.id));
    updatedAsteroids.push(...newSplitAsteroids);

    // Spawn new large asteroids to replace destroyed ones (from screen edges)
    for (let i = 0; i < largeAsteroidsDestroyed; i++) {
      updatedAsteroids.push(createNewAsteroid());
    }

    // Remove bullets that hit asteroids
    updatedBullets = updatedBullets.filter(b => !bulletsToRemove.has(b.id));

    // Ship-asteroid collisions (if not invulnerable)
    let shipHit = false;
    if (!state.ship.isInvulnerable) {
      const shipPos = shipPositionRef.current;
      for (const asteroid of updatedAsteroids) {
        if (checkCollision(shipPos, GAME_CONFIG.SHIP_RADIUS, asteroid.position, asteroid.radius)) {
          shipHit = true;
          // Spawn fiery ship explosion
          pendingExplosions.current.push({
            id: `ship-explosion-${Date.now()}`,
            position: { ...shipPos },
            size: 4,
            colors: FLAME_COLORS,
          });
          break;
        }
      }
    }

    // Combine all removed bullet IDs (expired + collided)
    const removedBulletIds = [...expiredBulletIds, ...Array.from(bulletsToRemove)];

    // Dispatch single tick update
    const tickPayload: TickPayload = {
      asteroids: updatedAsteroids,
      bullets: updatedBullets,
      removedBulletIds,
      scoreToAdd,
      shipHit,
      tickInvulnerability: state.ship.isInvulnerable,
    };

    dispatch({ type: "GAME_TICK", payload: tickPayload });

    // Flush pending explosions to state
    if (pendingExplosions.current.length > 0) {
      setExplosions(prev => [...prev, ...pendingExplosions.current]);
      pendingExplosions.current = [];
    }
  });

  const removeExplosion = useCallback((id: string) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <>
      <StarField />

      <hemisphereLight intensity={0.6} color="#8040df" groundColor="#404040" />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />

      <PlayArea />

      {state.phase === "playing" && (
        <>
          <Ship onPositionUpdate={updateShipPosition} />

          {state.asteroids.map((asteroid) => (
            <Asteroid
              key={asteroid.id}
              data={asteroid}
              onPositionUpdate={updateAsteroidPosition}
            />
          ))}

          {state.bullets.map((bullet) => (
            <Bullet
              key={bullet.id}
              data={bullet}
              onPositionUpdate={updateBulletPosition}
            />
          ))}

          {explosions.map((explosion) => (
            <Explosion
              key={explosion.id}
              position={explosion.position}
              size={explosion.size}
              colors={explosion.colors}
              onComplete={() => removeExplosion(explosion.id)}
            />
          ))}
        </>
      )}
    </>
  );
}
