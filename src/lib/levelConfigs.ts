// Level configurations for 10 distinct levels
import { EnemyType, LevelConfig } from './types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    enemies: 10,
    types: [EnemyType.BASIC],
    spawnDelay: 2000,
    description: "Rookie Training",
    enemyColor: "#ef4444", // Red
    enemyAccentColor: "#dc2626",
    enemyGlowColor: "#fbbf24"
  },
  {
    level: 2,
    enemies: 15,
    types: [EnemyType.BASIC, EnemyType.FAST],
    spawnDelay: 1800,
    description: "Speed Demons",
    enemyColor: "#f97316", // Orange
    enemyAccentColor: "#ea580c",
    enemyGlowColor: "#fb923c"
  },
  {
    level: 3,
    enemies: 20,
    types: [EnemyType.BASIC, EnemyType.TANK],
    spawnDelay: 1600,
    description: "Heavy Armor",
    enemyColor: "#8b5cf6", // Purple
    enemyAccentColor: "#7c3aed",
    enemyGlowColor: "#a78bfa"
  },
  {
    level: 4,
    enemies: 25,
    types: [EnemyType.BASIC, EnemyType.ZIGZAG],
    spawnDelay: 1400,
    description: "Evasive Tactics",
    enemyColor: "#06b6d4", // Cyan
    enemyAccentColor: "#0891b2",
    enemyGlowColor: "#22d3ee"
  },
  {
    level: 5,
    enemies: 30,
    types: [EnemyType.BASIC, EnemyType.SHOOTER],
    spawnDelay: 1200,
    description: "Return Fire",
    enemyColor: "#10b981", // Green
    enemyAccentColor: "#059669",
    enemyGlowColor: "#34d399"
  },
  {
    level: 6,
    enemies: 35,
    types: [EnemyType.FAST, EnemyType.ZIGZAG],
    spawnDelay: 1000,
    description: "Chaos Swarm",
    enemyColor: "#ec4899", // Pink
    enemyAccentColor: "#db2777",
    enemyGlowColor: "#f9a8d4"
  },
  {
    level: 7,
    enemies: 40,
    types: [EnemyType.TANK, EnemyType.SHOOTER],
    spawnDelay: 900,
    description: "Heavy Artillery",
    enemyColor: "#f59e0b", // Amber
    enemyAccentColor: "#d97706",
    enemyGlowColor: "#fbbf24"
  },
  {
    level: 8,
    enemies: 45,
    types: [EnemyType.FAST, EnemyType.SHOOTER, EnemyType.ZIGZAG],
    spawnDelay: 800,
    description: "Elite Squadron",
    enemyColor: "#6366f1", // Indigo
    enemyAccentColor: "#4f46e5",
    enemyGlowColor: "#818cf8"
  },
  {
    level: 9,
    enemies: 50,
    types: [EnemyType.BASIC, EnemyType.FAST, EnemyType.TANK, EnemyType.ZIGZAG, EnemyType.SHOOTER],
    spawnDelay: 700,
    description: "Final Assault",
    enemyColor: "#dc2626", // Dark Red
    enemyAccentColor: "#991b1b",
    enemyGlowColor: "#ef4444"
  },
  {
    level: 10,
    enemies: 1,
    types: [EnemyType.BOSS],
    spawnDelay: 5000,
    description: "FINAL BOSS",
    enemyColor: "#7c2d12", // Dark Brown/Red
    enemyAccentColor: "#431407",
    enemyGlowColor: "#ff0000"
  }
];

export function getLevelConfig(level: number): LevelConfig {
  const index = Math.min(level - 1, LEVEL_CONFIGS.length - 1);
  return LEVEL_CONFIGS[Math.max(0, index)];
}

export function getEnemyColorsForLevel(level: number): { color: string; accent: string; glow: string } {
  const config = getLevelConfig(level);
  return {
    color: config.enemyColor,
    accent: config.enemyAccentColor,
    glow: config.enemyGlowColor
  };
}
