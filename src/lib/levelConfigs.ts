// Level configurations for 10 distinct levels

import { EnemyType, type LevelConfig } from './types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    enemies: 15,
    types: [EnemyType.BASIC],
    spawnDelay: 2000,
    description: "Scout Squadron",
    theme: "Basic enemy scouts testing your defenses",
    enemyColor: "#ef4444" // red
  },
  {
    level: 2,
    enemies: 20,
    types: [EnemyType.BASIC, EnemyType.FAST],
    spawnDelay: 1800,
    description: "Speed Demons",
    theme: "Fast interceptors join the assault",
    enemyColor: "#f97316" // orange
  },
  {
    level: 3,
    enemies: 25,
    types: [EnemyType.BASIC, EnemyType.FAST, EnemyType.TANK],
    spawnDelay: 1600,
    description: "Heavy Armor",
    theme: "Armored cruisers enter the battlefield",
    enemyColor: "#eab308" // yellow
  },
  {
    level: 4,
    enemies: 30,
    types: [EnemyType.BASIC, EnemyType.ZIGZAG],
    spawnDelay: 1500,
    description: "Evasive Tactics",
    theme: "Zigzag fighters with unpredictable patterns",
    enemyColor: "#84cc16" // lime
  },
  {
    level: 5,
    enemies: 35,
    types: [EnemyType.BASIC, EnemyType.FAST, EnemyType.SHOOTER],
    spawnDelay: 1400,
    description: "Return Fire",
    theme: "Enemy gunships that shoot back",
    enemyColor: "#22c55e" // green
  },
  {
    level: 6,
    enemies: 40,
    types: [EnemyType.FAST, EnemyType.ZIGZAG, EnemyType.SHOOTER],
    spawnDelay: 1200,
    description: "Elite Squadron",
    theme: "Advanced enemy formations",
    enemyColor: "#14b8a6" // teal
  },
  {
    level: 7,
    enemies: 45,
    types: [EnemyType.TANK, EnemyType.SHOOTER, EnemyType.ZIGZAG],
    spawnDelay: 1100,
    description: "Heavy Artillery",
    theme: "Heavily armed battlecruisers",
    enemyColor: "#06b6d4" // cyan
  },
  {
    level: 8,
    enemies: 50,
    types: [EnemyType.FAST, EnemyType.SHOOTER, EnemyType.ZIGZAG, EnemyType.TANK],
    spawnDelay: 1000,
    description: "Armada Assault",
    theme: "Full enemy fleet deployment",
    enemyColor: "#3b82f6" // blue
  },
  {
    level: 9,
    enemies: 60,
    types: [EnemyType.BASIC, EnemyType.FAST, EnemyType.TANK, EnemyType.ZIGZAG, EnemyType.SHOOTER],
    spawnDelay: 900,
    description: "Final Wave",
    theme: "Everything they've got",
    enemyColor: "#8b5cf6" // purple
  },
  {
    level: 10,
    enemies: 1,
    types: [EnemyType.BOSS],
    spawnDelay: 5000,
    description: "FINAL BOSS",
    theme: "The Mothership awaits...",
    enemyColor: "#ec4899" // pink
  }
];

/**
 * Get configuration for a specific level
 */
export function getLevelConfig(level: number): LevelConfig {
  const index = Math.min(level - 1, LEVEL_CONFIGS.length - 1);
  return LEVEL_CONFIGS[Math.max(0, index)];
}

/**
 * Get enemy color for current level
 */
export function getEnemyColorForLevel(level: number): string {
  const config = getLevelConfig(level);
  return config.enemyColor;
}

/**
 * Check if level is a boss level
 */
export function isBossLevel(level: number): boolean {
  const config = getLevelConfig(level);
  return config.types.includes(EnemyType.BOSS);
}
