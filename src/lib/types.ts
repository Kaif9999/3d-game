// Shared TypeScript types and enums for the game

// Enemy types
export enum EnemyType {
  BASIC = 'basic',
  FAST = 'fast',
  TANK = 'tank',
  ZIGZAG = 'zigzag',
  SHOOTER = 'shooter',
  BOSS = 'boss'
}

// Power-up types
export enum PowerUpType {
  DOUBLE_SHOT = 'double_shot',
  TRIPLE_SHOT = 'triple_shot',
  SHIELD = 'shield',
  SPEED_BOOST = 'speed_boost',
  RAPID_FIRE = 'rapid_fire',
  LASER_BEAM = 'laser_beam',
  HOMING_MISSILE = 'homing_missile',
  TIME_SLOW = 'time_slow',
  SCORE_MULTIPLIER = 'score_multiplier',
  EXTRA_LIFE = 'extra_life'
}

export interface Alien {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: EnemyType;
  health: number;
  maxHealth: number;
  zigzagPhase?: number;
  lastShot?: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  isPlayerBullet: boolean;
  damage?: number;
  isHoming?: boolean;
  targetId?: number;
}

export interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
  speed: number;
}

export interface Explosion {
  id: number;
  x: number;
  y: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export interface ActivePowerUps {
  doubleShot: number;
  tripleShot: number;
  shield: number;
  speedBoost: number;
  rapidFire: number;
  laserBeam: number;
  homingMissile: number;
  timeSlow: number;
  scoreMultiplier: number;
  extraLife: number;
}

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  wave: number;
  date: string;
  id: string;
}
