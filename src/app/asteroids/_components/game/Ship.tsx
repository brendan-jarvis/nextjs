"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Shape, ShapeGeometry } from "three";
import type { Group } from "three";
import { useGameState } from "../hooks/useGameState";
import { GAME_CONFIG } from "../constants/gameConfig";
import type { BulletData } from "../types/game";

interface ShipProps {
  onPositionUpdate: (x: number, y: number, rotation: number) => void;
}

export function Ship({ onPositionUpdate }: ShipProps) {
  const { state, dispatch } = useGameState();
  const groupRef = useRef<Group>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const canFireRef = useRef(true);
  const blinkRef = useRef(true);
  const thrustingRef = useRef(false);
  const flameFlickerRef = useRef(0);
  const turningLeftRef = useRef(false);
  const turningRightRef = useRef(false);
  const rcsAnimRef = useRef(0);

  const { SHIP_ACCELERATION, SHIP_FRICTION, SHIP_TURN_SPEED, SHIP_MAX_SPEED, BOUNDS, BULLET_SPEED } = GAME_CONFIG;

  // Store dispatch in ref to avoid re-creating event listeners
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  // Handle keyboard input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Always prevent space from scrolling
      if (e.code === "Space") {
        e.preventDefault();
      }

      keysRef.current.add(e.code);

      if (e.code === "Space" && canFireRef.current && groupRef.current) {
        const pos = groupRef.current.position;
        const rotation = rotationRef.current;

        // Offset bullet spawn to ship's tip (2 units forward from center)
        const tipOffset = 2;
        const tipX = pos.x + Math.cos(rotation + Math.PI / 2) * tipOffset;
        const tipY = pos.y + Math.sin(rotation + Math.PI / 2) * tipOffset;

        const bullet: BulletData = {
          id: `bullet-${Date.now()}-${Math.random()}`,
          position: { x: tipX, y: tipY },
          velocity: {
            x: Math.cos(rotation + Math.PI / 2) * BULLET_SPEED,
            y: Math.sin(rotation + Math.PI / 2) * BULLET_SPEED,
          },
          rotation: rotation,
          lifetime: GAME_CONFIG.BULLET_LIFETIME,
        };

        dispatchRef.current({ type: "FIRE_SHOT", payload: bullet });
        canFireRef.current = false;
        setTimeout(() => {
          canFireRef.current = true;
        }, GAME_CONFIG.FIRE_COOLDOWN);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [BULLET_SPEED]);

  // Update ship physics
  useFrame((_, delta) => {
    if (!groupRef.current || state.phase !== "playing") return;

    const keys = keysRef.current;

    // Rotation
    const turningLeft = keys.has("ArrowLeft") || keys.has("KeyA");
    const turningRight = keys.has("ArrowRight") || keys.has("KeyD");
    turningLeftRef.current = turningLeft;
    turningRightRef.current = turningRight;

    if (turningLeft) {
      rotationRef.current += SHIP_TURN_SPEED;
    }
    if (turningRight) {
      rotationRef.current -= SHIP_TURN_SPEED;
    }

    // Thrust
    const isThrusting = keys.has("ArrowUp") || keys.has("KeyW");
    thrustingRef.current = isThrusting;

    if (isThrusting) {
      const thrustX = Math.cos(rotationRef.current + Math.PI / 2) * SHIP_ACCELERATION;
      const thrustY = Math.sin(rotationRef.current + Math.PI / 2) * SHIP_ACCELERATION;

      velocityRef.current.x += thrustX;
      velocityRef.current.y += thrustY;

      // Clamp speed
      const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
      if (speed > SHIP_MAX_SPEED) {
        velocityRef.current.x = (velocityRef.current.x / speed) * SHIP_MAX_SPEED;
        velocityRef.current.y = (velocityRef.current.y / speed) * SHIP_MAX_SPEED;
      }

      // Animate flame flicker
      flameFlickerRef.current += 0.3;
    }

    // Apply friction
    velocityRef.current.x *= SHIP_FRICTION;
    velocityRef.current.y *= SHIP_FRICTION;

    // Update position
    groupRef.current.position.x += velocityRef.current.x;
    groupRef.current.position.y += velocityRef.current.y;

    // Screen wrapping
    if (groupRef.current.position.x < BOUNDS.min) {
      groupRef.current.position.x = BOUNDS.max;
    } else if (groupRef.current.position.x > BOUNDS.max) {
      groupRef.current.position.x = BOUNDS.min;
    }

    if (groupRef.current.position.y < BOUNDS.min) {
      groupRef.current.position.y = BOUNDS.max;
    } else if (groupRef.current.position.y > BOUNDS.max) {
      groupRef.current.position.y = BOUNDS.min;
    }

    // Update rotation
    groupRef.current.rotation.z = rotationRef.current;

    // Report position for collision detection
    onPositionUpdate(
      groupRef.current.position.x,
      groupRef.current.position.y,
      rotationRef.current
    );

    // Blink effect for invulnerability (slower flicker)
    if (state.ship.isInvulnerable) {
      blinkRef.current = Math.floor(state.ship.invulnerabilityTimer / 15) % 2 === 0;
    } else {
      blinkRef.current = true;
    }
  });

  // Reset position when respawning
  useEffect(() => {
    if (groupRef.current && state.ship.isInvulnerable) {
      groupRef.current.position.x = 0;
      groupRef.current.position.y = 0;
      velocityRef.current = { x: 0, y: 0 };
      rotationRef.current = 0;
    }
  }, [state.ship.isInvulnerable, state.lives]);

  const shipPoints: [number, number, number][] = [
    [0, 2, 0],
    [-1.5, -2, 0],
    [0, -1, 0],
    [1.5, -2, 0],
    [0, 2, 0],
  ];

  // Create solid fill shape for the ship
  const shipFillGeometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0, 2);
    shape.lineTo(-1.5, -2);
    shape.lineTo(0, -1);
    shape.lineTo(1.5, -2);
    shape.lineTo(0, 2);
    return new ShapeGeometry(shape);
  }, []);

  const isVisible = !state.ship.isInvulnerable || blinkRef.current;

  // Thruster flame points - flickering triangle behind the ship
  const flameSize = 1 + Math.sin(flameFlickerRef.current) * 0.5 + Math.random() * 0.3;
  const thrusterPoints: [number, number, number][] = [
    [-0.8, -1.5, 0],
    [0, -1.5 - flameSize * 1.5, 0],
    [0.8, -1.5, 0],
  ];

  // Flame colors based on flicker
  const flameColors = ["#ff4400", "#ff6600", "#ff8800", "#ffaa00", "#ffcc00"];
  const flameColor = flameColors[Math.floor(Math.abs(Math.sin(flameFlickerRef.current * 2)) * flameColors.length)];

  // RCS thruster cone - animated spray pattern
  rcsAnimRef.current += 0.4;

  // Generate cone lines with animated variation
  const generateRcsCone = (baseX: number, direction: number): [number, number, number][][] => {
    const lines: [number, number, number][][] = [];
    const numLines = 5;
    const baseAngle = direction > 0 ? 0 : Math.PI; // Right or left
    const spreadAngle = Math.PI * 0.4; // 72 degree cone

    for (let i = 0; i < numLines; i++) {
      // Distribute lines across the cone with some randomness
      const t = (i / (numLines - 1)) - 0.5; // -0.5 to 0.5
      const angle = baseAngle + t * spreadAngle;

      // Animate length with offset per line
      const lengthAnim = Math.sin(rcsAnimRef.current + i * 1.5) * 0.15;
      const length = 0.5 + lengthAnim + Math.random() * 0.1;

      const startX = baseX;
      const startY = 1.0;
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      lines.push([[startX, startY, 0], [endX, endY, 0]]);
    }
    return lines;
  };

  const leftRcsLines = turningLeftRef.current ? generateRcsCone(0.5, 1) : [];
  const rightRcsLines = turningRightRef.current ? generateRcsCone(-0.5, -1) : [];

  return (
    <group ref={groupRef}>
      {/* RCS thrusters for turning - cone shaped sprays */}
      {turningLeftRef.current && isVisible && leftRcsLines.map((points, i) => (
        <Line key={`left-rcs-${i}`} points={points} color="#ffffff" lineWidth={1} />
      ))}
      {turningRightRef.current && isVisible && rightRcsLines.map((points, i) => (
        <Line key={`right-rcs-${i}`} points={points} color="#ffffff" lineWidth={1} />
      ))}
      {/* Main thruster flame */}
      {thrustingRef.current && isVisible && (
        <Line
          points={thrusterPoints}
          color={flameColor}
          lineWidth={2}
        />
      )}
      {/* Solid black fill to occlude stars */}
      <mesh geometry={shipFillGeometry} visible={isVisible}>
        <meshBasicMaterial color="#000000" />
      </mesh>
      <Line
        points={shipPoints}
        color={isVisible ? "white" : "transparent"}
        lineWidth={2}
      />
    </group>
  );
}
