export type GamePhase = "start" | "playing" | "paused" | "gameOver";

export type AsteroidSize = "large" | "medium" | "small";

export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
}

export interface AsteroidData extends GameObject {
  size: AsteroidSize;
  radius: number;
}

export interface BulletData extends GameObject {
  lifetime: number;
}

export interface ShipData extends GameObject {
  isThrusting: boolean;
  isInvulnerable: boolean;
  invulnerabilityTimer: number;
}

export interface GameState {
  phase: GamePhase;
  score: number;
  lives: number;
  level: number;
  ship: ShipData;
  asteroids: AsteroidData[];
  bullets: BulletData[];
  highScore: number;
}

export interface TickPayload {
  asteroids: AsteroidData[];
  bullets: BulletData[];
  removedBulletIds: string[];
  scoreToAdd: number;
  shipHit: boolean;
  tickInvulnerability: boolean;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "PAUSE_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "GAME_OVER" }
  | { type: "RESTART_GAME" }
  | { type: "FIRE_SHOT"; payload: BulletData }
  | { type: "GAME_TICK"; payload: TickPayload }
  | { type: "NEXT_LEVEL" }
  | { type: "SET_HIGH_SCORE"; payload: number };
