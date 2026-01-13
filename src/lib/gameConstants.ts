// Game Configuration Constants

// Game Loop & Performance
export const GAME_LOOP_FPS = 60;
export const GAME_LOOP_INTERVAL = 1000 / GAME_LOOP_FPS; // ~16.67ms for 60 FPS

// Player Settings
export const INITIAL_LIVES = 3;
export const PLAYER_SPEED = 1.5; // % per frame
export const PLAYER_SPEED_BOOST = 2.5; // % per frame with power-up
export const PLAYER_SIZE = 6; // % of screen
export const PLAYER_FIRE_DELAY = 200; // ms
export const PLAYER_RAPID_FIRE_DELAY = 100; // ms
export const PLAYER_START_X = 50; // %

// Bullet Settings
export const BULLET_SPEED = 2; // % per frame
export const BULLET_WIDTH = 0.3; // %
export const BULLET_HEIGHT = 1.2; // %
export const BULLET_DAMAGE = 1;

// Enemy Settings
export const ENEMY_BULLET_SPEED = 1.5; // % per frame
export const ENEMY_SHOOT_INTERVAL = 2000; // ms

// Enemy Sizes (% of screen)
export const ENEMY_SIZE_BASIC = 2.5;
export const ENEMY_SIZE_FAST = 2.5;
export const ENEMY_SIZE_TANK = 3;
export const ENEMY_SIZE_ZIGZAG = 2.5;
export const ENEMY_SIZE_SHOOTER = 2.5;
export const ENEMY_SIZE_BOSS = 5;

// Enemy Health
export const ENEMY_HEALTH_BASIC = 1;
export const ENEMY_HEALTH_FAST = 1;
export const ENEMY_HEALTH_TANK = 1;
export const ENEMY_HEALTH_ZIGZAG = 1;
export const ENEMY_HEALTH_SHOOTER = 1;
export const ENEMY_HEALTH_BOSS = 10;

// Enemy Scores
export const SCORE_BASIC = 100;
export const SCORE_FAST = 150;
export const SCORE_TANK = 300;
export const SCORE_ZIGZAG = 200;
export const SCORE_SHOOTER = 250;
export const SCORE_BOSS = 5000;

// Power-up Settings
export const POWERUP_DURATION = 10000; // ms (10 seconds)
export const POWERUP_SPAWN_CHANCE = 0.2; // 20%
export const POWERUP_SPEED = 1; // % per frame
export const POWERUP_COLLECTION_DISTANCE = 4; // %

// Visual Effects
export const MAX_PARTICLES = 200;
export const PARTICLE_LIFE_DECAY = 0.02; // per frame
export const PARTICLE_GRAVITY = 0.05;
export const MAX_STARS = 100;
export const EXPLOSION_DURATION = 400; // ms
export const SCREEN_SHAKE_DURATION = 200; // ms
export const SCREEN_SHAKE_PLAYER_HIT = 5;
export const SCREEN_SHAKE_BOSS_KILL = 10;

// Particle Colors
export const PARTICLE_COLOR_EXPLOSION = '#ff6b6b';
export const PARTICLE_COLOR_DAMAGE = '#feca57';
export const PARTICLE_COLOR_BULLET_COLLISION = '#60a5fa';
export const PARTICLE_COLOR_POWERUP = '#22d3ee';

// Spawning
export const ALIEN_SPAWN_BASE_DELAY = 2000; // ms
export const ALIEN_SPAWN_MIN_DELAY = 500; // ms
export const ALIEN_SPAWN_WAVE_REDUCTION = 100; // ms per wave
export const BOSS_SPAWN_WAVE_INTERVAL = 5; // Spawn boss every N waves

// Combo System
export const COMBO_TIMEOUT = 1000; // ms
export const COMBO_SCORE_BONUS = 0.1; // 10% bonus per combo level

// Storage Keys
export const HIGH_SCORE_STORAGE_KEY = 'spaceShooterHighScore';

// Audio
export const BACKGROUND_MUSIC_VOLUME = 0.3;
export const SFX_VOLUME = 0.5;

// Collision Detection
export const BULLET_COLLISION_THRESHOLD = 1; // distance in %
export const PLAYER_COLLISION_DISTANCE = 4; // distance in %

// Wave System
export const WAVE_CLEAR_THRESHOLD = 0; // Score must be > 0 to advance

// Level System
export const TOTAL_LEVELS = 10;
export const LEVEL_COMPLETE_DELAY = 2000; // ms before advancing to next level

// Leaderboard
export const LEADERBOARD_STORAGE_KEY = 'spaceShooterLeaderboard';
export const MAX_LEADERBOARD_ENTRIES = 10;
