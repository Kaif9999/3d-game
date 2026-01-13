import { LevelConfig, EnemyType } from './types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    name: "METEOR FIELD",
    description: "Basic Training - Destroy 15 enemies",
    enemiesToKill: 15,
    enemyTypes: [EnemyType.BASIC],
    enemyColor: "#ef4444", // Red
    enemySpeed: 0.4,
    spawnDelay: 2000,
  },
  {
    level: 2,
    name: "SPEED DEMONS",
    description: "Fast enemies incoming - Destroy 20 enemies",
    enemiesToKill: 20,
    enemyTypes: [EnemyType.BASIC, EnemyType.FAST],
    enemyColor: "#f97316", // Orange
    enemySpeed: 0.5,
    spawnDelay: 1800,
  },
  {
    level: 3,
    name: "TANK BRIGADE",
    description: "Heavy armor detected - Destroy 20 enemies",
    enemiesToKill: 20,
    enemyTypes: [EnemyType.BASIC, EnemyType.TANK],
    enemyColor: "#eab308", // Yellow
    enemySpeed: 0.45,
    spawnDelay: 1600,
  },
  {
    level: 4,
    name: "ZIGZAG CHAOS",
    description: "Evasive maneuvers - Destroy 25 enemies",
    enemiesToKill: 25,
    enemyTypes: [EnemyType.BASIC, EnemyType.ZIGZAG],
    enemyColor: "#84cc16", // Lime
    enemySpeed: 0.5,
    spawnDelay: 1500,
  },
  {
    level: 5,
    name: "UNDER FIRE",
    description: "Enemy shooters deployed - Destroy 25 enemies",
    enemiesToKill: 25,
    enemyTypes: [EnemyType.BASIC, EnemyType.SHOOTER],
    enemyColor: "#22c55e", // Green
    enemySpeed: 0.55,
    spawnDelay: 1400,
  },
  {
    level: 6,
    name: "ELITE SQUADRON",
    description: "Fast and evasive - Destroy 30 enemies",
    enemiesToKill: 30,
    enemyTypes: [EnemyType.FAST, EnemyType.ZIGZAG],
    enemyColor: "#06b6d4", // Cyan
    enemySpeed: 0.6,
    spawnDelay: 1300,
  },
  {
    level: 7,
    name: "HEAVY ASSAULT",
    description: "Tanks with firepower - Destroy 30 enemies",
    enemiesToKill: 30,
    enemyTypes: [EnemyType.TANK, EnemyType.SHOOTER],
    enemyColor: "#3b82f6", // Blue
    enemySpeed: 0.55,
    spawnDelay: 1200,
  },
  {
    level: 8,
    name: "CHAOS STORM",
    description: "Multiple enemy types - Destroy 35 enemies",
    enemiesToKill: 35,
    enemyTypes: [EnemyType.FAST, EnemyType.ZIGZAG, EnemyType.SHOOTER],
    enemyColor: "#8b5cf6", // Violet
    enemySpeed: 0.65,
    spawnDelay: 1100,
  },
  {
    level: 9,
    name: "FINAL WAVE",
    description: "All enemy types - Destroy 40 enemies",
    enemiesToKill: 40,
    enemyTypes: [EnemyType.BASIC, EnemyType.FAST, EnemyType.TANK, EnemyType.ZIGZAG, EnemyType.SHOOTER],
    enemyColor: "#d946ef", // Fuchsia
    enemySpeed: 0.7,
    spawnDelay: 1000,
  },
  {
    level: 10,
    name: "BOSS BATTLE",
    description: "Defeat the Mothership!",
    enemiesToKill: 1,
    enemyTypes: [EnemyType.BOSS],
    enemyColor: "#ef4444", // Red (Boss)
    enemySpeed: 0.15,
    spawnDelay: 5000,
    isBossLevel: true,
  },
];

export function getLevelConfig(level: number): LevelConfig {
  const index = Math.min(level - 1, LEVEL_CONFIGS.length - 1);
  return LEVEL_CONFIGS[Math.max(0, index)];
}
