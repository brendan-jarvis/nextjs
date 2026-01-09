export const GAME_CONFIG = {
  // Play area bounds
  BOUNDS: { min: -50, max: 50 },

  // Ship settings
  SHIP_RADIUS: 1.5,
  SHIP_ACCELERATION: 0.01,
  SHIP_MAX_SPEED: 0.25,
  SHIP_FRICTION: 0.99,
  SHIP_TURN_SPEED: 0.05,
  INVULNERABILITY_DURATION: 180, // frames (~3 seconds at 60fps)

  // Bullet settings
  BULLET_SPEED: 45,
  BULLET_RADIUS: 0.4,
  BULLET_LIFETIME: 90, // frames
  FIRE_COOLDOWN: 200, // ms between shots
  MAX_BULLETS: 4,

  // Asteroid settings
  ASTEROID_SIZES: {
    large: { radius: 4, speed: 3, points: 20 },
    medium: { radius: 2, speed: 4.5, points: 50 },
    small: { radius: 1, speed: 6, points: 100 },
  } as const,
  INITIAL_ASTEROID_COUNT: 4,
  ASTEROIDS_PER_LEVEL: 2,

  // Game settings
  STARTING_LIVES: 3,
  EXTRA_LIFE_SCORE: 10000,
  SPAWN_SAFE_RADIUS: 15, // Keep asteroids away from spawn point
} as const;

export type AsteroidSizeConfig = typeof GAME_CONFIG.ASTEROID_SIZES;
