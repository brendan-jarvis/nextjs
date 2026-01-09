"use client";

import { useReducer, useCallback, useEffect, createContext, useContext } from "react";
import type { GameState, GameAction, AsteroidData, AsteroidSize } from "../types/game";
import { GAME_CONFIG } from "../constants/gameConfig";

const initialShip = {
  id: "ship",
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  rotation: 0,
  isThrusting: false,
  isInvulnerable: false,
  invulnerabilityTimer: 0,
};

function createInitialAsteroids(count: number): AsteroidData[] {
  const asteroids: AsteroidData[] = [];
  const { BOUNDS, SPAWN_SAFE_RADIUS, ASTEROID_SIZES } = GAME_CONFIG;

  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    // Keep asteroids away from center spawn point
    do {
      x = Math.random() * (BOUNDS.max - BOUNDS.min) + BOUNDS.min;
      y = Math.random() * (BOUNDS.max - BOUNDS.min) + BOUNDS.min;
    } while (Math.sqrt(x * x + y * y) < SPAWN_SAFE_RADIUS);

    const angle = Math.random() * Math.PI * 2;
    const config = ASTEROID_SIZES.large;

    asteroids.push({
      id: `asteroid-${i}`,
      position: { x, y },
      velocity: {
        x: Math.cos(angle) * config.speed,
        y: Math.sin(angle) * config.speed,
      },
      rotation: Math.random() * Math.PI * 2,
      size: "large",
      radius: config.radius,
    });
  }

  return asteroids;
}

function getInitialState(): GameState {
  const storedHighScore = typeof window !== "undefined"
    ? parseInt(localStorage.getItem("asteroidsHighScore") ?? "0", 10)
    : 0;

  return {
    phase: "start",
    score: 0,
    lives: GAME_CONFIG.STARTING_LIVES,
    level: 1,
    ship: { ...initialShip },
    asteroids: [],
    bullets: [],
    highScore: storedHighScore,
  };
}

export function splitAsteroid(asteroid: AsteroidData): AsteroidData[] {
  if (asteroid.size === "small") {
    return [];
  }

  const newSize: AsteroidSize = asteroid.size === "large" ? "medium" : "small";
  const config = GAME_CONFIG.ASTEROID_SIZES[newSize];

  return [1, -1].map((direction, index) => ({
    id: `${asteroid.id}-${index}-${Date.now()}`,
    position: { ...asteroid.position },
    velocity: {
      x: Math.cos(asteroid.rotation + direction * Math.PI / 4) * config.speed,
      y: Math.sin(asteroid.rotation + direction * Math.PI / 4) * config.speed,
    },
    rotation: Math.random() * Math.PI * 2,
    size: newSize,
    radius: config.radius,
  }));
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        phase: "playing",
        score: 0,
        lives: GAME_CONFIG.STARTING_LIVES,
        level: 1,
        ship: { ...initialShip, isInvulnerable: true, invulnerabilityTimer: GAME_CONFIG.INVULNERABILITY_DURATION },
        asteroids: createInitialAsteroids(GAME_CONFIG.INITIAL_ASTEROID_COUNT),
        bullets: [],
      };

    case "PAUSE_GAME":
      return { ...state, phase: "paused" };

    case "RESUME_GAME":
      return { ...state, phase: "playing" };

    case "GAME_OVER": {
      const newHighScore = Math.max(state.score, state.highScore);
      if (typeof window !== "undefined" && newHighScore > state.highScore) {
        localStorage.setItem("asteroidsHighScore", String(newHighScore));
      }
      return {
        ...state,
        phase: "gameOver",
        highScore: newHighScore,
      };
    }

    case "RESTART_GAME":
      return {
        ...getInitialState(),
        phase: "playing",
        score: 0,
        lives: GAME_CONFIG.STARTING_LIVES,
        level: 1,
        ship: { ...initialShip, isInvulnerable: true, invulnerabilityTimer: GAME_CONFIG.INVULNERABILITY_DURATION },
        asteroids: createInitialAsteroids(GAME_CONFIG.INITIAL_ASTEROID_COUNT),
        bullets: [],
        highScore: state.highScore,
      };

    case "FIRE_SHOT":
      if (state.bullets.length >= GAME_CONFIG.MAX_BULLETS) {
        return state;
      }
      return {
        ...state,
        bullets: [...state.bullets, action.payload],
      };

    case "GAME_TICK": {
      const { asteroids, bullets: updatedBullets, removedBulletIds, scoreToAdd, shipHit, tickInvulnerability } = action.payload;

      // Preserve newly fired bullets that weren't in the payload
      // (They were added via FIRE_SHOT after useFrame read state.bullets)
      // But exclude bullets that were intentionally removed (expired or collided)
      const payloadBulletIds = new Set(updatedBullets.map(b => b.id));
      const removedIds = new Set(removedBulletIds);
      const newlyFiredBullets = state.bullets.filter(
        b => !payloadBulletIds.has(b.id) && !removedIds.has(b.id)
      );
      const mergedBullets = [...updatedBullets, ...newlyFiredBullets];

      let newState = {
        ...state,
        asteroids,
        bullets: mergedBullets,
        score: state.score + scoreToAdd,
      };

      // Handle invulnerability tick
      if (tickInvulnerability && state.ship.invulnerabilityTimer > 0) {
        const newTimer = state.ship.invulnerabilityTimer - 1;
        newState = {
          ...newState,
          ship: {
            ...state.ship,
            invulnerabilityTimer: newTimer,
            isInvulnerable: newTimer > 0,
          },
        };
      }

      // Handle ship hit
      if (shipHit) {
        const newLives = state.lives - 1;

        if (newLives <= 0) {
          const newHighScore = Math.max(newState.score, state.highScore);
          if (typeof window !== "undefined" && newHighScore > state.highScore) {
            localStorage.setItem("asteroidsHighScore", String(newHighScore));
          }
          return {
            ...newState,
            lives: 0,
            phase: "gameOver",
            highScore: newHighScore,
          };
        }

        return {
          ...newState,
          lives: newLives,
          ship: {
            ...initialShip,
            isInvulnerable: true,
            invulnerabilityTimer: GAME_CONFIG.INVULNERABILITY_DURATION,
          },
          bullets: [],
        };
      }

      return newState;
    }

    case "NEXT_LEVEL": {
      const newLevel = state.level + 1;
      const asteroidCount = GAME_CONFIG.INITIAL_ASTEROID_COUNT + (newLevel - 1) * GAME_CONFIG.ASTEROIDS_PER_LEVEL;

      return {
        ...state,
        level: newLevel,
        asteroids: createInitialAsteroids(asteroidCount),
        ship: {
          ...state.ship,
          position: { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          isInvulnerable: true,
          invulnerabilityTimer: GAME_CONFIG.INVULNERABILITY_DURATION,
        },
        bullets: [],
      };
    }

    case "SET_HIGH_SCORE":
      return { ...state, highScore: action.payload };

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  // Load high score on mount
  useEffect(() => {
    const stored = localStorage.getItem("asteroidsHighScore");
    if (stored) {
      dispatch({ type: "SET_HIGH_SCORE", payload: parseInt(stored, 10) });
    }
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
}

export function useGameActions() {
  const { dispatch } = useGameState();

  return {
    startGame: useCallback(() => dispatch({ type: "START_GAME" }), [dispatch]),
    pauseGame: useCallback(() => dispatch({ type: "PAUSE_GAME" }), [dispatch]),
    resumeGame: useCallback(() => dispatch({ type: "RESUME_GAME" }), [dispatch]),
    restartGame: useCallback(() => dispatch({ type: "RESTART_GAME" }), [dispatch]),
  };
}
