'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import audioManager from '@/utils/audioManager';
import * as CONSTANTS from '@/lib/gameConstants';
import { EnemyType, PowerUpType, type Alien, type Bullet, type PowerUp, type Explosion, type Particle, type Star, type ActivePowerUps, type LeaderboardEntry } from '@/lib/types';
import { powerUpTypeToStateKey, getPowerUpDisplayName, getPowerUpColor } from '@/lib/powerUpUtils';

interface SpaceShooterGameProps {}

export default function SpaceShooterGame(props: SpaceShooterGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return parseInt(localStorage.getItem('spaceShooterHighScore') || '0');
      } catch (error) {
        console.warn('Failed to load high score from localStorage:', error);
        return 0;
      }
    }
    return 0;
  });
  const [lives, setLives] = useState(CONSTANTS.INITIAL_LIVES);
  const [playerX, setPlayerX] = useState(CONSTANTS.PLAYER_START_X);
  const [volumeMusic, setVolumeMusic] = useState(CONSTANTS.BACKGROUND_MUSIC_VOLUME);
  const [volumeSFX, setVolumeSFX] = useState(CONSTANTS.SFX_VOLUME);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [level, setLevel] = useState(1);
  const [enemiesKilledInLevel, setEnemiesKilledInLevel] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastKillTime, setLastKillTime] = useState(0);
  const [screenShake, setScreenShake] = useState(0);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [timeSlowActive, setTimeSlowActive] = useState(false);
  const [wave, setWave] = useState(1);
  
  // Power-up states
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUps>({
    doubleShot: 0,
    tripleShot: 0,
    shield: 0,
    speedBoost: 0,
    rapidFire: 0,
    laserBeam: 0,
    homingMissile: 0,
    timeSlow: 0,
    scoreMultiplier: 0,
    extraLife: 0
  });
  
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const alienIdCounter = useRef(0);
  const bulletIdCounter = useRef(0);
  const explosionIdCounter = useRef(0);
  const starIdCounter = useRef(0);
  const particleIdCounter = useRef(0);
  const powerUpIdCounter = useRef(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastAlienSpawnRef = useRef(0);
  const lastFireTime = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const screenShakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Use refs to track current state for collision detection
  const aliensRef = useRef<Alien[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);

  // Sync refs with state
  useEffect(() => {
    aliensRef.current = aliens;
  }, [aliens]);

  useEffect(() => {
    bulletsRef.current = bullets;
  }, [bullets]);

  useEffect(() => {
    powerUpsRef.current = powerUps;
  }, [powerUps]);

  // Initialize stars
  useEffect(() => {
    const initialStars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      initialStars.push({
        id: starIdCounter.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }
    setStars(initialStars);
  }, []);

  // Safe audio manager wrapper
  const safeAudioCall = (audioFunction: () => void) => {
    try {
      audioFunction();
    } catch (error) {
      console.warn('Audio operation failed:', error);
    }
  };

  // Helper function to create particles
  const createParticles = (x: number, y: number, count: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 2 + 1;
      newParticles.push({
        id: particleIdCounter.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color
      });
    }
    setParticles(prev => {
      const combined = [...prev, ...newParticles];
      // Limit total particles to prevent performance issues
      if (combined.length > CONSTANTS.MAX_PARTICLES) {
        return combined.slice(-CONSTANTS.MAX_PARTICLES);
      }
      return combined;
    });
  };

  // Helper function to trigger screen shake
  const triggerScreenShake = (intensity: number) => {
    // Clear any existing shake timeout
    if (screenShakeTimeoutRef.current) {
      clearTimeout(screenShakeTimeoutRef.current);
    }
    
    setScreenShake(intensity);
    screenShakeTimeoutRef.current = setTimeout(() => {
      setScreenShake(0);
      screenShakeTimeoutRef.current = null;
    }, 200);
  };

  // Helper function to spawn power-up
  const spawnPowerUp = (x: number, y: number) => {
    if (Math.random() < 0.2) { // 20% chance
      const types = Object.values(PowerUpType);
      const type = types[Math.floor(Math.random() * types.length)];
      setPowerUps(prev => [...prev, {
        id: powerUpIdCounter.current++,
        x,
        y,
        type,
        speed: 0.3
      }]);
    }
  };

  // Helper function to get enemy colors
  const getEnemyColors = (type: EnemyType) => {
    switch (type) {
      case EnemyType.BASIC:
        return { primary: '#ef4444', secondary: '#dc2626', tertiary: '#991b1b' };
      case EnemyType.FAST:
        return { primary: '#f59e0b', secondary: '#d97706', tertiary: '#b45309' };
      case EnemyType.TANK:
        return { primary: '#6b7280', secondary: '#4b5563', tertiary: '#374151' };
      case EnemyType.ZIGZAG:
        return { primary: '#8b5cf6', secondary: '#7c3aed', tertiary: '#6d28d9' };
      case EnemyType.SHOOTER:
        return { primary: '#ec4899', secondary: '#db2777', tertiary: '#be185d' };
      case EnemyType.STEALTH:
        return { primary: '#14b8a6', secondary: '#0d9488', tertiary: '#0f766e' };
      case EnemyType.SHIELD:
        return { primary: '#3b82f6', secondary: '#2563eb', tertiary: '#1d4ed8' };
      case EnemyType.BOMBER:
        return { primary: '#eab308', secondary: '#ca8a04', tertiary: '#a16207' };
      case EnemyType.SWARM:
        return { primary: '#10b981', secondary: '#059669', tertiary: '#047857' };
      case EnemyType.ELITE:
        return { primary: '#a855f7', secondary: '#9333ea', tertiary: '#7e22ce' };
      case EnemyType.BOSS:
        return { primary: '#dc2626', secondary: '#991b1b', tertiary: '#7f1d1d' };
      default:
        return { primary: '#ef4444', secondary: '#dc2626', tertiary: '#991b1b' };
    }
  };

  // Helper function to get enemy stats
  const getEnemyStats = (type: EnemyType) => {
    switch (type) {
      case EnemyType.BASIC:
        return { health: 1, speed: 0.4, points: 100 };
      case EnemyType.FAST:
        return { health: 1, speed: 0.8, points: 150 };
      case EnemyType.TANK:
        return { health: 1, speed: 0.2, points: 300 };
      case EnemyType.ZIGZAG:
        return { health: 1, speed: 0.4, points: 200 };
      case EnemyType.SHOOTER:
        return { health: 1, speed: 0.3, points: 250 };
      case EnemyType.STEALTH:
        return { health: 1, speed: 0.6, points: 400 };
      case EnemyType.SHIELD:
        return { health: 2, speed: 0.3, points: 500 };
      case EnemyType.BOMBER:
        return { health: 1, speed: 0.35, points: 350 };
      case EnemyType.SWARM:
        return { health: 1, speed: 0.7, points: 180 };
      case EnemyType.ELITE:
        return { health: 3, speed: 0.5, points: 800 };
      case EnemyType.BOSS:
        return { health: 30, speed: 0.15, points: 10000 };
      default:
        return { health: 1, speed: 0.4, points: 100 };
    }
  };

  // Leaderboard functions
  const getLeaderboard = (): LeaderboardEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('spaceShooterLeaderboard');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
      return [];
    }
  };

  const saveToLeaderboard = (name: string, score: number, level: number) => {
    if (typeof window === 'undefined') return;
    try {
      const leaderboard = getLeaderboard();
      leaderboard.push({ name, score, level, date: Date.now() });
      leaderboard.sort((a, b) => b.score - a.score);
      const top10 = leaderboard.slice(0, 10);
      localStorage.setItem('spaceShooterLeaderboard', JSON.stringify(top10));
    } catch (error) {
      console.warn('Failed to save to leaderboard:', error);
    }
  };

  // Level configuration - 10 levels + 1 boss level
  const getLevelConfig = (level: number) => {
    const configs = [
      { enemies: 10, types: [EnemyType.BASIC], spawnDelay: 2000, description: "Level 1: Basic Training" },
      { enemies: 15, types: [EnemyType.BASIC, EnemyType.FAST], spawnDelay: 1800, description: "Level 2: Speed Demons" },
      { enemies: 20, types: [EnemyType.TANK, EnemyType.FAST], spawnDelay: 1600, description: "Level 3: Heavy Assault" },
      { enemies: 25, types: [EnemyType.ZIGZAG, EnemyType.BASIC], spawnDelay: 1400, description: "Level 4: Evasive Action" },
      { enemies: 30, types: [EnemyType.SHOOTER, EnemyType.ZIGZAG], spawnDelay: 1200, description: "Level 5: Under Fire" },
      { enemies: 35, types: [EnemyType.STEALTH, EnemyType.FAST], spawnDelay: 1000, description: "Level 6: Shadow Fleet" },
      { enemies: 40, types: [EnemyType.SHIELD, EnemyType.SHOOTER], spawnDelay: 900, description: "Level 7: Fortified Defenses" },
      { enemies: 45, types: [EnemyType.BOMBER, EnemyType.TANK], spawnDelay: 800, description: "Level 8: Explosive Chaos" },
      { enemies: 50, types: [EnemyType.SWARM, EnemyType.STEALTH], spawnDelay: 700, description: "Level 9: Swarm Invasion" },
      { enemies: 55, types: [EnemyType.ELITE, EnemyType.SHIELD], spawnDelay: 600, description: "Level 10: Elite Squadron" },
      { enemies: 1, types: [EnemyType.BOSS], spawnDelay: 0, description: "BOSS: Final Showdown" }
    ];
    return configs[Math.min(level - 1, configs.length - 1)];
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Initialize audio on first interaction
      await audioManager.initializeOnUserInteraction();
      
      keysPressed.current.add(e.key.toLowerCase());
      
      if (e.key === ' ' && gameStarted && !gameOver && !gamePaused) {
        e.preventDefault();
        const now = Date.now();
        const fireDelay = activePowerUps.rapidFire > 0 ? CONSTANTS.PLAYER_RAPID_FIRE_DELAY : CONSTANTS.PLAYER_FIRE_DELAY;

        if (now - lastFireTime.current > fireDelay) {
          lastFireTime.current = now;

          // Fire bullets based on active power-ups
          const newBullets: Bullet[] = [];

          // Laser beam - continuous vertical damage
          if (activePowerUps.laserBeam > 0) {
            // Create multiple laser segments for continuous beam effect
            for (let i = 0; i < 10; i++) {
              newBullets.push({
                id: bulletIdCounter.current++,
                x: playerX,
                y: 90 - (i * 8),
                isPlayerBullet: true,
                damage: 2
              });
            }
          }
          // Homing missile - targets nearest enemy
          else if (activePowerUps.homingMissile > 0 && aliensRef.current.length > 0) {
            const nearestAlien = aliensRef.current.reduce((nearest, alien) => {
              const dist = Math.sqrt(Math.pow(alien.x - playerX, 2) + Math.pow(alien.y - 90, 2));
              const nearestDist = Math.sqrt(Math.pow(nearest.x - playerX, 2) + Math.pow(nearest.y - 90, 2));
              return dist < nearestDist ? alien : nearest;
            });

            newBullets.push({
              id: bulletIdCounter.current++,
              x: playerX,
              y: 90,
              isPlayerBullet: true,
              damage: 3,
              isHoming: true,
              targetId: nearestAlien.id
            });
          }
          else if (activePowerUps.tripleShot > 0) {
            // Triple shot pattern
            newBullets.push(
              { id: bulletIdCounter.current++, x: playerX - 2, y: 90, isPlayerBullet: true, damage: 1 },
              { id: bulletIdCounter.current++, x: playerX, y: 90, isPlayerBullet: true, damage: 1 },
              { id: bulletIdCounter.current++, x: playerX + 2, y: 90, isPlayerBullet: true, damage: 1 }
            );
          } else if (activePowerUps.doubleShot > 0) {
            // Double shot pattern
            newBullets.push(
              { id: bulletIdCounter.current++, x: playerX - 1, y: 90, isPlayerBullet: true, damage: 1 },
              { id: bulletIdCounter.current++, x: playerX + 1, y: 90, isPlayerBullet: true, damage: 1 }
            );
          } else {
            // Single shot
            newBullets.push(
              { id: bulletIdCounter.current++, x: playerX, y: 90, isPlayerBullet: true, damage: 1 }
            );
          }

          setBullets(prev => [...prev, ...newBullets]);
        }
      }
      
      // Handle pause with ESC key
      if (e.key === 'Escape' && gameStarted && !gameOver) {
        e.preventDefault();
        setGamePaused(prev => {
          const newPaused = !prev;
          if (newPaused) {
            safeAudioCall(() => audioManager.pauseBackgroundMusic());
            safeAudioCall(() => audioManager.playSound('pause'));
          } else {
            safeAudioCall(() => audioManager.resumeBackgroundMusic());
            safeAudioCall(() => audioManager.playSound('pause'));
          }
          return newPaused;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, gamePaused, playerX]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused) return;

    const gameLoop = () => {
      // Move player with speed boost
      setPlayerX(prev => {
        let newX = prev;
        const speed = activePowerUps.speedBoost > 0 ? CONSTANTS.PLAYER_SPEED_BOOST : CONSTANTS.PLAYER_SPEED;
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
          newX = Math.max(5, prev - speed);
        }
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
          newX = Math.min(95, prev + speed);
        }
        return newX;
      });

      // Update stars
      setStars(prev => prev.map(star => ({
        ...star,
        y: (star.y + star.speed) % 100,
      })));

      // Move bullets
      setBullets(prev => prev.map(bullet => {
        let newX = bullet.x;
        let newY = bullet.y;

        // Homing missile logic
        if (bullet.isHoming && bullet.targetId !== undefined) {
          const target = aliensRef.current.find(a => a.id === bullet.targetId);
          if (target) {
            // Move towards target
            const dx = target.x - bullet.x;
            const dy = target.y - bullet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
              const speed = 3;
              newX = bullet.x + (dx / dist) * speed;
              newY = bullet.y + (dy / dist) * speed;
            }
          } else {
            // Target destroyed, move upward
            newY = bullet.y - CONSTANTS.BULLET_SPEED;
          }
        } else {
          // Normal bullet movement
          const speedMult = timeSlowActive ? 0.5 : 1;
          newY = bullet.isPlayerBullet ? bullet.y - (CONSTANTS.BULLET_SPEED * speedMult) : bullet.y + (CONSTANTS.ENEMY_BULLET_SPEED * speedMult);
        }

        return { ...bullet, x: newX, y: newY };
      }).filter(bullet => bullet.isPlayerBullet ? bullet.y > -5 : bullet.y < 105));

      // Move aliens with different patterns
      setAliens(prev => prev.map(alien => {
        let newX = alien.x;
        const speedMult = timeSlowActive ? 0.3 : 1;
        let newY = alien.y + (alien.speed * speedMult);
        
        // Handle different movement patterns
        if (alien.type === EnemyType.ZIGZAG) {
          const phase = (alien.zigzagPhase || 0) + 0.1;
          newX = alien.x + Math.sin(phase) * 0.5;
          return { ...alien, x: newX, y: newY, zigzagPhase: phase };
        }
        
        // Shooter enemies fire bullets
        if (alien.type === EnemyType.SHOOTER) {
          const now = Date.now();
          if (!alien.lastShot || now - alien.lastShot > 2000) {
            setBullets(bullets => [...bullets, {
              id: bulletIdCounter.current++,
              x: alien.x,
              y: alien.y + 2,
              isPlayerBullet: false,
              damage: 1
            }]);
            return { ...alien, y: newY, lastShot: now };
          }
        }
        
        return { ...alien, y: newY };
      }).filter(alien => alien.y < 105));
      
      // Move power-ups
      setPowerUps(prev => prev.map(powerUp => ({
        ...powerUp,
        y: powerUp.y + powerUp.speed,
      })).filter(powerUp => powerUp.y < 105));
      
      // Update particles
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.1, // gravity
        life: particle.life - 0.02
      })).filter(particle => particle.life > 0));

      // Check collisions between bullets and aliens
      const currentAliens = aliensRef.current;
      const currentBullets = bulletsRef.current;
      const currentPowerUps = powerUpsRef.current;
      const aliensToUpdate = new Map<number, Alien>();
      const aliensToRemove = new Set<number>();
      const bulletsToRemove = new Set<number>();
      const powerUpsToRemove = new Set<number>();
      const newExplosions: Explosion[] = [];

      currentAliens.forEach(alien => {
        currentBullets.forEach(bullet => {
          // Skip if already marked for removal or wrong bullet type
          if (aliensToRemove.has(alien.id) || bulletsToRemove.has(bullet.id) || !bullet.isPlayerBullet) return;

          // Adjusted hitboxes based on enemy type
          const getAlienSize = (type: EnemyType) => {
            if (type === EnemyType.BOSS) return 5;
            if (type === EnemyType.TANK) return 3;
            if (type === EnemyType.ELITE) return 3.5;
            if (type === EnemyType.SWARM) return 2;
            return 2.5;
          };
          const alienSize = getAlienSize(alien.type);
          const alienLeft = alien.x - alienSize;
          const alienRight = alien.x + alienSize;
          const alienTop = alien.y - alienSize;
          const alienBottom = alien.y + alienSize;
          const bulletLeft = bullet.x - 0.15;
          const bulletRight = bullet.x + 0.15;
          const bulletTop = bullet.y - 0.6;
          const bulletBottom = bullet.y + 0.6;

          if (bulletRight > alienLeft && bulletLeft < alienRight &&
              bulletBottom > alienTop && bulletTop < alienBottom) {
            bulletsToRemove.add(bullet.id);
            
            // Handle enemy health
            const damage = bullet.damage || 1;
            const newHealth = alien.health - damage;
            
            if (newHealth <= 0) {
              aliensToRemove.add(alien.id);
              const stats = getEnemyStats(alien.type);

              // Increment enemies killed counter
              setEnemiesKilledInLevel(prev => prev + 1);

              // Update score with combo
              const now = Date.now();
              if (now - lastKillTime < 1000) {
                setCombo(prev => prev + 1);
              } else {
                setCombo(1);
              }
              setLastKillTime(now);

              const points = stats.points * (1 + combo * CONSTANTS.COMBO_SCORE_BONUS) * scoreMultiplier;
              setScore(prev => prev + Math.floor(points));

              // Spawn power-up chance
              spawnPowerUp(alien.x, alien.y);

              // Create explosion with particles
              newExplosions.push({
                id: explosionIdCounter.current++,
                x: alien.x,
                y: alien.y,
              });
              createParticles(alien.x, alien.y, 8, '#ff6b6b');

              // Screen shake for boss
              if (alien.type === EnemyType.BOSS) {
                triggerScreenShake(10);
              }

              safeAudioCall(() => audioManager.playSound('laserHit'));
            } else {
              aliensToUpdate.set(alien.id, { ...alien, health: newHealth });
              createParticles(alien.x, alien.y, 3, '#feca57');
            }
          }
        });
      });
      
      // Check collisions between player bullets and enemy bullets
      currentBullets.forEach(playerBullet => {
        if (!playerBullet.isPlayerBullet) return;
        
        currentBullets.forEach(enemyBullet => {
          if (enemyBullet.isPlayerBullet || bulletsToRemove.has(playerBullet.id) || bulletsToRemove.has(enemyBullet.id)) return;
          
          const distance = Math.sqrt(Math.pow(playerBullet.x - enemyBullet.x, 2) + Math.pow(playerBullet.y - enemyBullet.y, 2));
          if (distance < 1) {
            bulletsToRemove.add(playerBullet.id);
            bulletsToRemove.add(enemyBullet.id);
            createParticles((playerBullet.x + enemyBullet.x) / 2, (playerBullet.y + enemyBullet.y) / 2, 4, '#60a5fa');
          }
        });
      });
      
      // Check power-up collection
      currentPowerUps.forEach(powerUp => {
        const distance = Math.sqrt(Math.pow(powerUp.x - playerX, 2) + Math.pow(powerUp.y - 90, 2));
        if (distance < CONSTANTS.POWERUP_COLLECTION_DISTANCE) {
          powerUpsToRemove.add(powerUp.id);

          // Apply power-up effect using proper key mapping
          const stateKey = powerUpTypeToStateKey(powerUp.type);

          // Handle special power-ups
          if (powerUp.type === PowerUpType.EXTRA_LIFE) {
            setLives(prev => prev + 1);
            safeAudioCall(() => audioManager.playSound('gameStart'));
          } else if (powerUp.type === PowerUpType.SCORE_MULTIPLIER) {
            setScoreMultiplier(prev => prev + 1);
            setActivePowerUps(prev => ({
              ...prev,
              [stateKey]: Date.now() + CONSTANTS.POWERUP_DURATION
            }));
          } else if (powerUp.type === PowerUpType.TIME_SLOW) {
            setTimeSlowActive(true);
            setActivePowerUps(prev => ({
              ...prev,
              [stateKey]: Date.now() + CONSTANTS.POWERUP_DURATION
            }));
          } else {
            setActivePowerUps(prev => ({
              ...prev,
              [stateKey]: Date.now() + CONSTANTS.POWERUP_DURATION
            }));
          }

          createParticles(powerUp.x, powerUp.y, 6, CONSTANTS.PARTICLE_COLOR_POWERUP);
          safeAudioCall(() => audioManager.playSound('gameStart')); // Reuse sound for power-up
        }
      });

      // Update and remove entities
      if (aliensToUpdate.size > 0 || aliensToRemove.size > 0) {
        setAliens(prev => prev.map(alien => {
          if (aliensToUpdate.has(alien.id)) {
            return aliensToUpdate.get(alien.id)!;
          }
          return alien;
        }).filter(a => !aliensToRemove.has(a.id)));
      }

      if (bulletsToRemove.size > 0) {
        setBullets(prev => prev.filter(b => !bulletsToRemove.has(b.id)));
      }
      
      if (powerUpsToRemove.size > 0) {
        setPowerUps(prev => prev.filter(p => !powerUpsToRemove.has(p.id)));
      }

      if (newExplosions.length > 0) {
        setExplosions(prev => [...prev, ...newExplosions]);
        setTimeout(() => {
          setExplosions(prev => prev.filter(e => 
            !newExplosions.find(ne => ne.id === e.id)
          ));
        }, 400);
      }
      
      // Update power-up timers
      setActivePowerUps(prev => {
        const now = Date.now();
        const newState = {
          doubleShot: prev.doubleShot > now ? prev.doubleShot : 0,
          tripleShot: prev.tripleShot > now ? prev.tripleShot : 0,
          shield: prev.shield > now ? prev.shield : 0,
          speedBoost: prev.speedBoost > now ? prev.speedBoost : 0,
          rapidFire: prev.rapidFire > now ? prev.rapidFire : 0,
          laserBeam: prev.laserBeam > now ? prev.laserBeam : 0,
          homingMissile: prev.homingMissile > now ? prev.homingMissile : 0,
          timeSlow: prev.timeSlow > now ? prev.timeSlow : 0,
          scoreMultiplier: prev.scoreMultiplier > now ? prev.scoreMultiplier : 0,
          extraLife: prev.extraLife > now ? prev.extraLife : 0
        };

        // Handle time slow expiration
        if (prev.timeSlow > now && newState.timeSlow === 0) {
          setTimeSlowActive(false);
        }

        // Handle score multiplier expiration
        if (prev.scoreMultiplier > now && newState.scoreMultiplier === 0) {
          setScoreMultiplier(1);
        }

        return newState;
      });

      // Check collisions with player
      const checkPlayerCollisions = () => {
        if (activePowerUps.shield > Date.now()) return; // Shield protection
        
        let playerHit = false;
        const entitiesToRemove = { aliens: new Set<number>(), bullets: new Set<number>() };
        
        // Check alien collisions
        currentAliens.forEach(alien => {
          const getAlienSize = (type: EnemyType) => {
            if (type === EnemyType.BOSS) return 5;
            if (type === EnemyType.TANK) return 3;
            if (type === EnemyType.ELITE) return 3.5;
            if (type === EnemyType.SWARM) return 2;
            return 2.5;
          };
          const alienSize = getAlienSize(alien.type);
          const alienLeft = alien.x - alienSize;
          const alienRight = alien.x + alienSize;
          const alienTop = alien.y - alienSize;
          const alienBottom = alien.y + alienSize;
          const playerLeft = playerX - 3;
          const playerRight = playerX + 3;
          const playerTop = 87;
          const playerBottom = 93;

          if (alienRight > playerLeft && alienLeft < playerRight &&
              alienBottom > playerTop && alienTop < playerBottom) {
            entitiesToRemove.aliens.add(alien.id);
            playerHit = true;
          }
        });
        
        // Check enemy bullet collisions
        currentBullets.forEach(bullet => {
          if (bullet.isPlayerBullet) return;
          
          const bulletLeft = bullet.x - 0.15;
          const bulletRight = bullet.x + 0.15;
          const bulletTop = bullet.y - 0.6;
          const bulletBottom = bullet.y + 0.6;
          const playerLeft = playerX - 3;
          const playerRight = playerX + 3;
          const playerTop = 87;
          const playerBottom = 93;
          
          if (bulletRight > playerLeft && bulletLeft < playerRight &&
              bulletBottom > playerTop && bulletTop < playerBottom) {
            entitiesToRemove.bullets.add(bullet.id);
            playerHit = true;
          }
        });
        
        if (playerHit) {
          triggerScreenShake(5);
          createParticles(playerX, 90, 10, '#ef4444');
          
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setGameStarted(false);
              audioManager.stopBackgroundMusic();
              audioManager.playSound('gameOver');

              // Update high score
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('spaceShooterHighScore', score.toString());
              }

              // Save to leaderboard if player has a name
              if (playerName) {
                saveToLeaderboard(playerName, score, level);
              }
            }
            return newLives;
          });
        }
        
        // Remove collided entities
        if (entitiesToRemove.aliens.size > 0) {
          setAliens(prev => prev.filter(a => !entitiesToRemove.aliens.has(a.id)));
        }
        if (entitiesToRemove.bullets.size > 0) {
          setBullets(prev => prev.filter(b => !entitiesToRemove.bullets.has(b.id)));
        }
      };
      
      checkPlayerCollisions();

      // Spawn new aliens based on level
      const now = Date.now();
      const levelConfig = getLevelConfig(level);

      if (enemiesKilledInLevel < levelConfig.enemies) {
        const spawnDelay = levelConfig.spawnDelay;

        if (now - lastAlienSpawnRef.current > spawnDelay && currentAliens.length < 10) {
          lastAlienSpawnRef.current = now;

          // Select enemy type from level config
          const types = levelConfig.types;
          const type = types[Math.floor(Math.random() * types.length)];

          const stats = getEnemyStats(type);
          const newAlien: Alien = {
            id: alienIdCounter.current++,
            x: type === EnemyType.BOSS ? 50 : Math.random() * 80 + 10,
            y: -5,
            type,
            speed: stats.speed,
            health: stats.health,
            maxHealth: stats.health,
            zigzagPhase: type === EnemyType.ZIGZAG ? Math.random() * Math.PI * 2 : undefined
          };

          setAliens(prev => [...prev, newAlien]);
        }
      }

      // Check level completion
      if (currentAliens.length === 0 && enemiesKilledInLevel >= levelConfig.enemies && score > 0) {
        if (level < 11) {
          setLevelComplete(true);
          createParticles(50, 50, 20, '#22d3ee');
          setTimeout(() => {
            setLevel(prev => prev + 1);
            setEnemiesKilledInLevel(0);
            setLevelComplete(false);
          }, 2000);
        } else {
          // Game won!
          setGameWon(true);
          setGameOver(true);
          setGameStarted(false);
          audioManager.stopBackgroundMusic();
          audioManager.playSound('gameStart');

          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('spaceShooterHighScore', score.toString());
          }

          if (playerName) {
            saveToLeaderboard(playerName, score, level);
          }
        }
      }
    };

    gameLoopRef.current = setInterval(gameLoop, 50);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, gamePaused, score, playerX, wave, combo, highScore, activePowerUps, lastKillTime]);

  const startGame = async () => {
    // Initialize audio on user interaction
    await audioManager.initializeOnUserInteraction();

    setGameStarted(true);
    setGameOver(false);
    setGamePaused(false);
    setGameWon(false);
    setScore(0);
    setLives(CONSTANTS.INITIAL_LIVES);
    setPlayerX(CONSTANTS.PLAYER_START_X);
    setAliens([]);
    setBullets([]);
    setPowerUps([]);
    setExplosions([]);
    setParticles([]);
    setLevel(1);
    setEnemiesKilledInLevel(0);
    setLevelComplete(false);
    setWave(1);
    setCombo(0);
    setLastKillTime(0);
    setScreenShake(0);
    setScoreMultiplier(1);
    setTimeSlowActive(false);
    setActivePowerUps({
      doubleShot: 0,
      tripleShot: 0,
      shield: 0,
      speedBoost: 0,
      rapidFire: 0,
      laserBeam: 0,
      homingMissile: 0,
      timeSlow: 0,
      scoreMultiplier: 0,
      extraLife: 0
    });
    lastAlienSpawnRef.current = Date.now();
    lastFireTime.current = 0;

    // Play start sound and begin background music
    audioManager.playSound('gameStart');
    setTimeout(() => {
      audioManager.startBackgroundMusic();
    }, 600); // Start music after start sound
  };

  const handleStartClick = () => {
    if (!playerName.trim()) {
      setShowNameInput(true);
    } else {
      startGame();
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setShowNameInput(false);
      startGame();
    }
  };

  // Pause menu handlers
  const handleResume = () => {
    setGamePaused(false);
    safeAudioCall(() => audioManager.resumeBackgroundMusic());
    safeAudioCall(() => audioManager.playSound('pause'));
  };

  const handleRestart = async () => {
    setGamePaused(false);
    await startGame();
  };

  const handleQuitToMenu = () => {
    setGamePaused(false);
    setGameStarted(false);
    setGameOver(false);
    setGameWon(false);
    audioManager.stopBackgroundMusic();
    // Reset game state
    setScore(0);
    setLives(CONSTANTS.INITIAL_LIVES);
    setPlayerX(CONSTANTS.PLAYER_START_X);
    setAliens([]);
    setBullets([]);
    setPowerUps([]);
    setExplosions([]);
    setParticles([]);
    setLevel(1);
    setEnemiesKilledInLevel(0);
    setLevelComplete(false);
    setWave(1);
    setCombo(0);
    setLastKillTime(0);
    setScreenShake(0);
    setScoreMultiplier(1);
    setTimeSlowActive(false);
    setActivePowerUps({
      doubleShot: 0,
      tripleShot: 0,
      shield: 0,
      speedBoost: 0,
      rapidFire: 0,
      laserBeam: 0,
      homingMissile: 0,
      timeSlow: 0,
      scoreMultiplier: 0,
      extraLife: 0
    });
  };

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver || gamePaused) return;
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver || gamePaused || touchStartX === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    const container = gameContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const touchX = (touch.clientX / containerWidth) * 100;
    setPlayerX(Math.max(5, Math.min(95, touchX)));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver || gamePaused) return;

    // Tap to shoot
    if (touchStartX !== null && touchStartY !== null) {
      const now = Date.now();
      const fireDelay = activePowerUps.rapidFire > 0 ? CONSTANTS.PLAYER_RAPID_FIRE_DELAY : CONSTANTS.PLAYER_FIRE_DELAY;

      if (now - lastFireTime.current > fireDelay) {
        lastFireTime.current = now;
        const newBullets: Bullet[] = [];

        if (activePowerUps.tripleShot > 0) {
          newBullets.push(
            { id: bulletIdCounter.current++, x: playerX - 2, y: 90, isPlayerBullet: true, damage: 1 },
            { id: bulletIdCounter.current++, x: playerX, y: 90, isPlayerBullet: true, damage: 1 },
            { id: bulletIdCounter.current++, x: playerX + 2, y: 90, isPlayerBullet: true, damage: 1 }
          );
        } else if (activePowerUps.doubleShot > 0) {
          newBullets.push(
            { id: bulletIdCounter.current++, x: playerX - 1, y: 90, isPlayerBullet: true, damage: 1 },
            { id: bulletIdCounter.current++, x: playerX + 1, y: 90, isPlayerBullet: true, damage: 1 }
          );
        } else {
          newBullets.push(
            { id: bulletIdCounter.current++, x: playerX, y: 90, isPlayerBullet: true, damage: 1 }
          );
        }

        setBullets(prev => [...prev, ...newBullets]);
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  const togglePause = () => {
    if (!gameStarted || gameOver) return;
    setGamePaused(prev => {
      const newPaused = !prev;
      if (newPaused) {
        safeAudioCall(() => audioManager.pauseBackgroundMusic());
        safeAudioCall(() => audioManager.playSound('pause'));
      } else {
        safeAudioCall(() => audioManager.resumeBackgroundMusic());
        safeAudioCall(() => audioManager.playSound('pause'));
      }
      return newPaused;
    });
  };

  return (
    <div
      ref={gameContainerRef}
      className="game-container bg-gradient-to-b from-black via-gray-900 to-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="application"
      aria-label="Space Shooter Game"
    >
      {/* Stars background */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-10">
        {/* Frosted black background behind header */}
        <div className="absolute inset-0 -mx-4 -mt-4 bg-black/70 backdrop-blur-sm rounded-b-lg border-b border-white/10" style={{ height: 'calc(100% + 4px)' }}></div>
        
        <div className="relative flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`life ${i < lives ? 'active' : ''}`}
                style={{ opacity: i < lives ? 1 : 0.3 }}
              />
            ))}
            {/* Mute button */}
            <button
              onClick={() => {
                const newMuted = audioManager.toggleMute();
                setIsMuted(newMuted);
              }}
              className="ml-4 px-3 py-1 border-2 border-green-400 bg-black text-green-400 font-mono text-sm hover:bg-green-400 hover:text-black transition-all"
              style={{ letterSpacing: '0.1em' }}
              aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              aria-pressed={isMuted}
            >
              {isMuted ? 'UNMUTE' : 'MUTE'}
            </button>

            {/* Pause button */}
            {gameStarted && !gameOver && (
              <button
                onClick={togglePause}
                className="ml-2 px-3 py-1 border-2 border-cyan-400 bg-black text-cyan-400 font-mono text-sm hover:bg-cyan-400 hover:text-black transition-all"
                style={{ letterSpacing: '0.1em' }}
                aria-label={gamePaused ? 'Resume game' : 'Pause game'}
                aria-pressed={gamePaused}
              >
                {gamePaused ? 'RESUME' : 'PAUSE'}
              </button>
            )}
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Level indicator */}
            <div className="text-green-400 font-mono text-lg">
              {getLevelConfig(level).description}
            </div>

            {/* Combo indicator */}
            {combo > 1 && (
              <div className="text-yellow-400 font-mono text-lg animate-pulse">
                COMBO x{combo}
              </div>
            )}

            {/* Score */}
            <div className="score-display text-2xl font-bold px-4 py-2">
              SCORE: {score.toString().padStart(6, '0')}
            </div>
          </div>
        </div>
        
        {/* Power-up indicators */}
        <div className="flex gap-2 mt-2 justify-end flex-wrap">
          {activePowerUps.doubleShot > Date.now() && (
            <div className="px-2 py-1 bg-blue-500 text-white font-mono text-xs" role="status" aria-live="polite">
              DOUBLE SHOT: {Math.ceil((activePowerUps.doubleShot - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.tripleShot > Date.now() && (
            <div className="px-2 py-1 bg-purple-500 text-white font-mono text-xs" role="status" aria-live="polite">
              TRIPLE SHOT: {Math.ceil((activePowerUps.tripleShot - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.shield > Date.now() && (
            <div className="px-2 py-1 bg-green-500 text-white font-mono text-xs" role="status" aria-live="polite">
              SHIELD: {Math.ceil((activePowerUps.shield - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.speedBoost > Date.now() && (
            <div className="px-2 py-1 bg-yellow-500 text-white font-mono text-xs" role="status" aria-live="polite">
              SPEED: {Math.ceil((activePowerUps.speedBoost - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.rapidFire > Date.now() && (
            <div className="px-2 py-1 bg-red-500 text-white font-mono text-xs" role="status" aria-live="polite">
              RAPID FIRE: {Math.ceil((activePowerUps.rapidFire - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.laserBeam > Date.now() && (
            <div className="px-2 py-1 bg-green-500 text-white font-mono text-xs" role="status" aria-live="polite">
              LASER BEAM: {Math.ceil((activePowerUps.laserBeam - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.homingMissile > Date.now() && (
            <div className="px-2 py-1 bg-orange-500 text-white font-mono text-xs" role="status" aria-live="polite">
              HOMING: {Math.ceil((activePowerUps.homingMissile - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.timeSlow > Date.now() && (
            <div className="px-2 py-1 bg-indigo-500 text-white font-mono text-xs" role="status" aria-live="polite">
              TIME SLOW: {Math.ceil((activePowerUps.timeSlow - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.scoreMultiplier > Date.now() && (
            <div className="px-2 py-1 bg-pink-500 text-white font-mono text-xs" role="status" aria-live="polite">
              {scoreMultiplier}x SCORE: {Math.ceil((activePowerUps.scoreMultiplier - Date.now()) / 1000)}s
            </div>
          )}
        </div>
        
        {/* High score */}
        {highScore > 0 && (
          <div className="text-center mt-2 text-green-400 font-mono text-sm">
            HIGH SCORE: {highScore.toString().padStart(6, '0')}
          </div>
        )}
      </div>
      
      {/* Level Complete Notification */}
      {levelComplete && gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-4 animate-pulse" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textShadow: '0 0 20px #22c55e'
            }}>
              LEVEL {level} COMPLETE!
            </div>
            <div className="text-2xl text-yellow-400 font-mono">
              NEXT LEVEL STARTING...
            </div>
          </div>
        </div>
      )}

      {/* Pause Menu */}
      {gamePaused && gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70">
          <div className="retro-box border-4 border-green-400 bg-black p-8 min-w-[400px]">
            <h2 className="text-5xl font-bold text-green-400 mb-8 text-center" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              GAME PAUSED
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={handleResume}
                className="w-full retro-button px-8 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em'
                }}
              >
                RESUME GAME
              </button>
              
              <button
                onClick={handleRestart}
                className="w-full retro-button px-8 py-4 border-4 border-yellow-400 bg-black text-yellow-400 font-bold text-xl hover:bg-yellow-400 hover:text-black transition-all"
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em'
                }}
              >
                RESTART GAME
              </button>
              
              <button
                onClick={handleQuitToMenu}
                className="w-full retro-button px-8 py-4 border-4 border-red-400 bg-black text-red-400 font-bold text-xl hover:bg-red-400 hover:text-black transition-all"
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em'
                }}
              >
                QUIT TO MENU
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-green-400/70 text-sm" style={{ fontFamily: 'monospace' }}>
                Press ESC to resume
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Player ship - Blue Ship (60px) */}
      {gameStarted && !gameOver && (
        <div
          className="player-ship"
          style={{ 
            left: `${playerX}%`,
            transform: `translateX(-50%) ${screenShake > 0 ? `translate(${Math.random() * screenShake - screenShake/2}px, ${Math.random() * screenShake - screenShake/2}px)` : ''}`
          }}
        >
          <svg viewBox="0 0 30 30" className="w-full h-full">
            <defs>
              <linearGradient id="playerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            {/* Shield effect */}
            {activePowerUps.shield > Date.now() && (
              <circle cx="15" cy="15" r="14" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6">
                <animate attributeName="r" values="12;14;12" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.5s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Main body */}
            <path
              d="M15 2 L22 28 L15 24 L8 28 Z"
              fill="url(#playerGradient)"
              stroke="#1e40af"
              strokeWidth="1.5"
            />
            {/* Cockpit */}
            <circle cx="15" cy="12" r="3" fill="#1e40af" />
            <circle cx="15" cy="12" r="2" fill="#60a5fa" opacity="0.8" />
            {/* Engine glow */}
            <circle cx="15" cy="26" r="2" fill="#60a5fa" opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}

      {/* Aliens - Enemy Ships with Different Colors */}
      {gameStarted && !gameOver && aliens.map((alien) => {
        const colors = getEnemyColors(alien.type);
        const isBoss = alien.type === EnemyType.BOSS;
        const size = isBoss ? 100 : alien.type === EnemyType.TANK ? 60 : alien.type === EnemyType.SWARM ? 40 : 50;

        return (
        <div key={alien.id}>
          <div
            className="alien"
            style={{
              left: `${alien.x}%`,
              top: `${alien.y}%`,
              width: isBoss ? '80px' : alien.type === EnemyType.TANK ? '60px' : alien.type === EnemyType.SWARM ? '40px' : '50px',
              height: isBoss ? '80px' : alien.type === EnemyType.TANK ? '60px' : alien.type === EnemyType.SWARM ? '40px' : '50px'
            }}
            role="img"
            aria-label={`${alien.type} enemy ship`}
          >
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <defs>
                <linearGradient id={`alienGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="50%" stopColor={colors.secondary} />
                  <stop offset="100%" stopColor={colors.tertiary} />
                </linearGradient>
              </defs>

              {/* Shield effect for SHIELD type */}
              {alien.type === EnemyType.SHIELD && (
                <circle cx="25" cy="25" r="22" fill="none" stroke={colors.primary} strokeWidth="2" opacity="0.5">
                  <animate attributeName="r" values="20;22;20" dur="1s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Different shapes for different enemy types */}
              {(alien.type === EnemyType.BOSS || alien.type === EnemyType.ELITE) ? (
                <>
                  {/* Large inverted triangle for boss/elite */}
                  <path
                    d="M25 5 L45 40 L25 35 L5 40 Z"
                    fill={`url(#alienGradient${alien.id})`}
                    stroke={colors.tertiary}
                    strokeWidth="2"
                  />
                  <path d="M5 25 L1 30 L5 35 Z" fill={colors.secondary} stroke={colors.tertiary} strokeWidth="1.5" />
                  <path d="M45 25 L49 30 L45 35 Z" fill={colors.secondary} stroke={colors.tertiary} strokeWidth="1.5" />
                </>
              ) : alien.type === EnemyType.SWARM ? (
                <>
                  {/* Small triangle for swarm */}
                  <path
                    d="M25 12 L35 32 L25 28 L15 32 Z"
                    fill={`url(#alienGradient${alien.id})`}
                    stroke={colors.tertiary}
                    strokeWidth="2"
                  />
                </>
              ) : (
                <>
                  {/* Standard inverted triangle */}
                  <path
                    d="M25 8 L40 35 L25 30 L10 35 Z"
                    fill={`url(#alienGradient${alien.id})`}
                    stroke={colors.tertiary}
                    strokeWidth="2"
                  />
                  <path d="M10 20 L5 25 L10 28 Z" fill={colors.secondary} stroke={colors.tertiary} strokeWidth="1.5" />
                  <path d="M40 20 L45 25 L40 28 Z" fill={colors.secondary} stroke={colors.tertiary} strokeWidth="1.5" />
                </>
              )}

              {/* Cockpit */}
              <circle cx="25" cy={alien.type === EnemyType.SWARM ? "20" : "18"} r={alien.type === EnemyType.SWARM ? "3" : "4"} fill="#1f2937" />
              <circle cx="25" cy={alien.type === EnemyType.SWARM ? "20" : "18"} r={alien.type === EnemyType.SWARM ? "2" : "3"} fill={colors.primary} opacity="0.7">
                <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1s" repeatCount="indefinite" />
              </circle>

              {/* Engine exhausts - different for stealth */}
              {alien.type === EnemyType.STEALTH ? (
                <circle cx="25" cy="32" r="2" fill={colors.primary} opacity="0.4">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.5s" repeatCount="indefinite" />
                </circle>
              ) : (
                <>
                  <circle cx="18" cy={alien.type === EnemyType.SWARM ? "30" : "32"} r="2" fill="#fbbf24" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="32" cy={alien.type === EnemyType.SWARM ? "30" : "32"} r="2" fill="#fbbf24" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Special marker for bomber */}
              {alien.type === EnemyType.BOMBER && (
                <circle cx="25" cy="25" r="3" fill="#f97316" opacity="0.8">
                  <animate attributeName="r" values="2;4;2" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
            </svg>
          </div>

          {/* Health Bar for Boss and Elite */}
          {(alien.type === EnemyType.BOSS || alien.type === EnemyType.ELITE) && (
            <div
              className="absolute z-10"
              style={{
                left: `${alien.x}%`,
                top: `${alien.y - 5}%`,
                transform: 'translateX(-50%)',
                width: '100px'
              }}
            >
              <div className="bg-red-900 border-2 border-red-500 h-3 relative">
                <div
                  className="bg-red-500 h-full transition-all duration-200"
                  style={{ width: `${(alien.health / alien.maxHealth) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="text-center text-white font-mono text-xs mt-1 font-bold drop-shadow-[0_0_3px_rgba(0,0,0,1)]">
                {alien.type === EnemyType.BOSS ? 'BOSS' : 'ELITE'}: {alien.health}/{alien.maxHealth}
              </div>
            </div>
          )}
        </div>
        );
      })}

      {/* Bullets - Small Red Lasers */}
      {gameStarted && !gameOver && bullets.map((bullet) => (
        <div
          key={bullet.id}
          className="bullet"
          style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
        />
      ))}

      {/* Explosions */}
      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          className="explosion"
          style={{ left: `${explosion.x}%`, top: `${explosion.y}%` }}
        />
      ))}

      {/* Start Screen - Retro Style */}
      {!gameStarted && !gameOver && !showNameInput && !showLeaderboard && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
          {/* Retro Title */}
          <div className="text-center mb-8">
            <h1 className="retro-title text-7xl font-bold mb-4 text-green-400" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              SPACE
            </h1>
            <h1 className="retro-title text-7xl font-bold mb-6 text-green-400" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              SHOOTER
            </h1>
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-400"></div>
              <div className="w-3 h-3 bg-green-400"></div>
              <div className="w-3 h-3 bg-green-400"></div>
            </div>
          </div>

          {/* Player name display or input prompt */}
          {playerName && (
            <div className="text-green-400 font-mono text-lg mb-4">
              PILOT: {playerName}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleStartClick}
              className="retro-button px-12 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-2xl hover:bg-green-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.2em'
              }}
              aria-label="Start new game"
              autoFocus
            >
              START GAME
            </button>

            <button
              onClick={() => setShowLeaderboard(true)}
              className="retro-button px-12 py-4 border-4 border-yellow-400 bg-black text-yellow-400 font-bold text-xl hover:bg-yellow-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.2em'
              }}
            >
              LEADERBOARD
            </button>
          </div>

          {/* Touch Controls Info for Mobile */}
          <div className="mt-6 text-green-400 text-sm md:hidden" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            TOUCH: Move ship • TAP: Fire
          </div>

          {/* Retro decoration */}
          <div className="mt-8 text-green-400/50 text-xs" style={{ fontFamily: 'monospace' }}>
            © 1982 CLASSIC ARCADE
          </div>
        </div>
      )}

      {/* Name Input Screen */}
      {showNameInput && !gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
          <div className="retro-box border-4 border-green-400 bg-black p-8 max-w-md">
            <h2 className="text-3xl font-bold text-green-400 mb-6 text-center" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em'
            }}>
              ENTER YOUR NAME
            </h2>
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                className="w-full px-4 py-3 border-4 border-green-400 bg-black text-green-400 font-mono text-xl text-center focus:outline-none focus:bg-green-400 focus:text-black"
                placeholder="PILOT NAME"
                maxLength={20}
                autoFocus
                style={{ letterSpacing: '0.1em' }}
              />
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={!playerName.trim()}
                  className="w-full retro-button px-8 py-3 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em'
                  }}
                >
                  START MISSION
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameInput(false)}
                  className="w-full retro-button px-8 py-3 border-4 border-red-400 bg-black text-red-400 font-bold text-lg hover:bg-red-400 hover:text-black transition-all"
                  style={{
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em'
                  }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leaderboard Screen */}
      {showLeaderboard && !gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/90 px-4">
          <div className="retro-box border-4 border-yellow-400 bg-black p-8 max-w-2xl w-full">
            <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em'
            }}>
              TOP PILOTS
            </h2>
            <div className="space-y-2 mb-6">
              {getLeaderboard().length === 0 ? (
                <div className="text-green-400 text-center py-8 font-mono">
                  NO SCORES YET
                </div>
              ) : (
                getLeaderboard().map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-2 border-yellow-400/30 p-3 bg-black/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-yellow-400 font-mono text-2xl font-bold" style={{ width: '40px' }}>
                        #{index + 1}
                      </span>
                      <span className="text-green-400 font-mono text-lg">
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-cyan-400 font-mono text-sm">
                        LVL {entry.level}
                      </span>
                      <span className="text-green-400 font-mono text-xl font-bold">
                        {entry.score.toString().padStart(6, '0')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="w-full retro-button px-8 py-3 border-4 border-yellow-400 bg-black text-yellow-400 font-bold text-xl hover:bg-yellow-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.15em'
              }}
            >
              BACK
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen - Retro Style */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 overflow-y-auto py-8">
          <div className="retro-box border-4 border-red-500 bg-black p-8 max-w-2xl w-full">
            <h2 className="text-5xl font-bold text-center mb-4" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              color: gameWon ? '#22c55e' : '#ef4444'
            }}>
              {gameWon ? 'VICTORY!' : 'GAME OVER'}
            </h2>

            {gameWon && (
              <div className="text-yellow-400 text-center mb-4 font-mono text-xl">
                ALL LEVELS COMPLETED!
              </div>
            )}

            <div className="border-4 border-red-500/50 bg-black p-6 mb-6">
              <div className="text-green-400 text-center mb-2" style={{ fontFamily: 'monospace' }}>
                {playerName ? `PILOT: ${playerName}` : 'FINAL SCORE'}
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-mono">LEVEL REACHED:</span>
                <span className="text-green-400 font-mono text-2xl font-bold">{level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-mono">SCORE:</span>
                <span className="text-green-400 font-mono text-3xl font-bold">{score.toString().padStart(6, '0')}</span>
              </div>
            </div>

            {/* Mini Leaderboard */}
            <div className="border-4 border-yellow-400/50 bg-black p-4 mb-6">
              <h3 className="text-yellow-400 font-mono text-lg mb-3 text-center">TOP 5 PILOTS</h3>
              <div className="space-y-2">
                {getLeaderboard().slice(0, 5).map((entry, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-2 ${
                      playerName && entry.name === playerName && entry.score === score
                        ? 'bg-green-400/20 border-2 border-green-400'
                        : 'border border-yellow-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-mono font-bold">#{index + 1}</span>
                      <span className="text-green-400 font-mono text-sm">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-mono text-xs">L{entry.level}</span>
                      <span className="text-green-400 font-mono">{entry.score.toString().padStart(6, '0')}</span>
                    </div>
                  </div>
                ))}
                {getLeaderboard().length === 0 && (
                  <div className="text-green-400/50 text-center font-mono text-sm py-2">
                    No scores yet
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full retro-button px-8 py-3 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em'
                }}
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => {
                  setGameOver(false);
                  setGameWon(false);
                  setShowLeaderboard(true);
                }}
                className="w-full retro-button px-8 py-3 border-4 border-yellow-400 bg-black text-yellow-400 font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all"
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em'
                }}
              >
                VIEW LEADERBOARD
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
