'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import audioManager from '@/utils/audioManager';
import * as CONSTANTS from '@/lib/gameConstants';
import { EnemyType, PowerUpType, type Alien, type Bullet, type PowerUp, type Explosion, type Particle, type Star, type ActivePowerUps } from '@/lib/types';
import { powerUpTypeToStateKey, getPowerUpDisplayName, getPowerUpColor } from '@/lib/powerUpUtils';

interface SpaceShooterGameProps {}

export default function SpaceShooterGame(props: SpaceShooterGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
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
  const [levelTransition, setLevelTransition] = useState(false);
  const [levelUpText, setLevelUpText] = useState('');

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

  // Helper function to get enemy stats
  const getEnemyStats = (type: EnemyType) => {
    switch (type) {
      case EnemyType.FAST:
        return { health: 1, speed: 0.8, points: 150 };
      case EnemyType.TANK:
        return { health: 1, speed: 0.2, points: 300 }; // Changed to 1 health
      case EnemyType.ZIGZAG:
        return { health: 1, speed: 0.4, points: 200 }; // Changed to 1 health
      case EnemyType.SHOOTER:
        return { health: 1, speed: 0.3, points: 250 }; // Changed to 1 health
      case EnemyType.BOSS:
        return { health: 20, speed: 0.15, points: 5000 }; // Boss still has multiple health
      default:
        return { health: 1, speed: 0.4, points: 100 };
    }
  };

  // Level configuration
  const getLevelConfig = (level: number) => {
    const configs = [
      { enemies: 10, types: [EnemyType.BASIC], spawnDelay: 2000, description: "Basic Training" },
      { enemies: 15, types: [EnemyType.BASIC, EnemyType.FAST], spawnDelay: 1800, description: "Speed Challenge" },
      { enemies: 20, types: [EnemyType.BASIC, EnemyType.TANK], spawnDelay: 1600, description: "Heavy Resistance" },
      { enemies: 25, types: [EnemyType.BASIC, EnemyType.ZIGZAG], spawnDelay: 1400, description: "Evasive Maneuvers" },
      { enemies: 30, types: [EnemyType.BASIC, EnemyType.SHOOTER], spawnDelay: 1200, description: "Under Fire" },
      { enemies: 35, types: [EnemyType.FAST, EnemyType.ZIGZAG], spawnDelay: 1000, description: "Chaos Mode" },
      { enemies: 40, types: [EnemyType.TANK, EnemyType.SHOOTER], spawnDelay: 900, description: "Heavy Artillery" },
      { enemies: 45, types: [EnemyType.FAST, EnemyType.SHOOTER, EnemyType.ZIGZAG], spawnDelay: 800, description: "Elite Forces" },
      { enemies: 50, types: [EnemyType.BASIC, EnemyType.FAST, EnemyType.TANK, EnemyType.ZIGZAG, EnemyType.SHOOTER], spawnDelay: 700, description: "Final Assault" },
      { enemies: 1, types: [EnemyType.BOSS], spawnDelay: 5000, description: "Boss Battle" }
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

          // Adjusted hitboxes
          const alienSize = alien.type === EnemyType.BOSS ? 5 : alien.type === EnemyType.TANK ? 3 : 2.5;
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
          const alienSize = alien.type === EnemyType.BOSS ? 5 : alien.type === EnemyType.TANK ? 3 : 2.5;
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

      // Spawn new aliens based on wave
      const now = Date.now();
      const spawnDelay = Math.max(500, 2000 - wave * 100);
      
      if (now - lastAlienSpawnRef.current > spawnDelay) {
        lastAlienSpawnRef.current = now;
        
        // Determine enemy type based on wave
        let type = EnemyType.BASIC;
        const rand = Math.random();
        
        if (wave % 5 === 0 && currentAliens.filter(a => a.type === EnemyType.BOSS).length === 0) {
          // Boss every 5 waves
          type = EnemyType.BOSS;
        } else if (wave >= 2 && rand < 0.2) {
          type = EnemyType.FAST;
        } else if (wave >= 3 && rand < 0.15) {
          type = EnemyType.TANK;
        } else if (wave >= 4 && rand < 0.15) {
          type = EnemyType.ZIGZAG;
        } else if (wave >= 5 && rand < 0.1) {
          type = EnemyType.SHOOTER;
        }
        
        const stats = getEnemyStats(type);
        const newAlien: Alien = {
          id: alienIdCounter.current++,
          x: type === EnemyType.BOSS ? 50 : Math.random() * 80 + 10,
          y: -5,
          type,
          speed: stats.speed + wave * 0.02,
          health: stats.health,
          maxHealth: stats.health,
          zigzagPhase: type === EnemyType.ZIGZAG ? Math.random() * Math.PI * 2 : undefined
        };
        
        setAliens(prev => [...prev, newAlien]);
      }
      
      // Check wave progression
      if (currentAliens.length === 0 && score > 0) {
        setWave(prev => {
          const newWave = prev + 1;

          // Level up every 5 waves
          if (newWave % 5 === 1 && newWave > 1) {
            const newLevel = Math.floor((newWave - 1) / 5) + 1;
            setLevel(newLevel);
            setLevelTransition(true);
            const config = getLevelConfig(newLevel);
            setLevelUpText(`LEVEL ${newLevel}: ${config.description}`);

            // Hide level transition after 3 seconds
            setTimeout(() => {
              setLevelTransition(false);
            }, 3000);
          }

          return newWave;
        });
        createParticles(50, 50, 20, '#22d3ee');
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
    setScore(0);
    setLives(CONSTANTS.INITIAL_LIVES);
    setPlayerX(CONSTANTS.PLAYER_START_X);
    setAliens([]);
    setBullets([]);
    setPowerUps([]);
    setExplosions([]);
    setParticles([]);
    setWave(1);
    setLevel(1);
    setLevelTransition(false);
    setLevelUpText('');
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
    setWave(1);
    setLevel(1);
    setLevelTransition(false);
    setLevelUpText('');
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
            <div className="text-cyan-400 font-mono text-lg border-2 border-cyan-400 px-3 py-1 bg-black/50">
              LVL {level}
            </div>

            {/* Wave indicator */}
            <div className="text-green-400 font-mono text-lg">
              WAVE: {wave}
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
      
      {/* Level Transition Notification */}
      {levelTransition && (
        <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
          <div className="retro-box border-4 border-cyan-400 bg-black/90 p-8 animate-pulse">
            <h2 className="text-5xl font-bold text-cyan-400 text-center" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(34, 211, 238, 0.8)'
            }}>
              {levelUpText}
            </h2>
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

      {/* Aliens - Different designs based on type */}
      {gameStarted && !gameOver && aliens.map((alien) => {
        // Render different SVG based on enemy type
        const renderEnemyShip = () => {
          switch (alien.type) {
            case EnemyType.BASIC:
              // Basic enemy - Red inverted triangle
              return (
                <svg viewBox="0 0 50 50" className="w-full h-full">
                  <defs>
                    <linearGradient id={`basicGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                  </defs>
                  <path d="M25 8 L40 35 L25 30 L10 35 Z" fill={`url(#basicGradient${alien.id})`} stroke="#7f1d1d" strokeWidth="2" />
                  <path d="M10 20 L5 25 L10 28 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                  <path d="M40 20 L45 25 L40 28 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                  <circle cx="25" cy="18" r="4" fill="#1f2937" />
                  <circle cx="25" cy="18" r="3" fill="#ef4444" opacity="0.7">
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="18" cy="32" r="2" fill="#fbbf24" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="32" cy="32" r="2" fill="#fbbf24" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                </svg>
              );

            case EnemyType.FAST:
              // Fast enemy - Sleek orange/yellow design with speed trail
              return (
                <svg viewBox="0 0 50 50" className="w-full h-full">
                  <defs>
                    <linearGradient id={`fastGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {/* Speed trail */}
                  <ellipse cx="25" cy="35" rx="8" ry="3" fill="#f59e0b" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="0.2s" repeatCount="indefinite" />
                  </ellipse>
                  {/* Sleek arrow body */}
                  <path d="M25 5 L35 30 L25 27 L15 30 Z" fill={`url(#fastGradient${alien.id})`} stroke="#92400e" strokeWidth="1.5" />
                  {/* Side fins */}
                  <path d="M15 18 L10 22 L15 24 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
                  <path d="M35 18 L40 22 L35 24 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
                  {/* Cockpit */}
                  <circle cx="25" cy="14" r="3" fill="#1f2937" />
                  <circle cx="25" cy="14" r="2" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  {/* Engine */}
                  <circle cx="25" cy="28" r="2.5" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="0.15s" repeatCount="indefinite" />
                  </circle>
                </svg>
              );

            case EnemyType.TANK:
              // Tank enemy - Heavy armored green/gray design
              return (
                <svg viewBox="0 0 60 60" className="w-full h-full">
                  <defs>
                    <linearGradient id={`tankGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6b7280" />
                      <stop offset="50%" stopColor="#4b5563" />
                      <stop offset="100%" stopColor="#374151" />
                    </linearGradient>
                  </defs>
                  {/* Heavy body */}
                  <rect x="15" y="12" width="30" height="28" rx="3" fill={`url(#tankGradient${alien.id})`} stroke="#1f2937" strokeWidth="2.5" />
                  {/* Armor plates */}
                  <rect x="12" y="16" width="6" height="8" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
                  <rect x="42" y="16" width="6" height="8" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
                  <rect x="12" y="28" width="6" height="8" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
                  <rect x="42" y="28" width="6" height="8" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
                  {/* Turret */}
                  <rect x="25" y="8" width="10" height="8" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
                  {/* Cockpit */}
                  <circle cx="30" cy="22" r="5" fill="#1f2937" />
                  <circle cx="30" cy="22" r="3.5" fill="#6b7280" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Engines */}
                  <circle cx="22" cy="38" r="2.5" fill="#ef4444" opacity="0.7">
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="38" cy="38" r="2.5" fill="#ef4444" opacity="0.7">
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.4s" repeatCount="indefinite" />
                  </circle>
                </svg>
              );

            case EnemyType.ZIGZAG:
              // ZigZag enemy - Angular purple/pink design
              return (
                <svg viewBox="0 0 50 50" className="w-full h-full">
                  <defs>
                    <linearGradient id={`zigzagGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#7e22ce" />
                    </linearGradient>
                  </defs>
                  {/* Angular zigzag body */}
                  <path d="M25 8 L35 18 L40 28 L30 38 L25 32 L20 38 L10 28 L15 18 Z" fill={`url(#zigzagGradient${alien.id})`} stroke="#581c87" strokeWidth="2" />
                  {/* Side spikes */}
                  <path d="M10 28 L5 28 L10 30 Z" fill="#9333ea" stroke="#581c87" strokeWidth="1" />
                  <path d="M40 28 L45 28 L40 30 Z" fill="#9333ea" stroke="#581c87" strokeWidth="1" />
                  {/* Cockpit */}
                  <circle cx="25" cy="20" r="4" fill="#1f2937" />
                  <circle cx="25" cy="20" r="3" fill="#a855f7" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  {/* Engines */}
                  <circle cx="20" cy="36" r="2" fill="#ec4899" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="30" cy="36" r="2" fill="#ec4899" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                </svg>
              );

            case EnemyType.SHOOTER:
              // Shooter enemy - Blue design with visible weapons
              return (
                <svg viewBox="0 0 50 50" className="w-full h-full">
                  <defs>
                    <linearGradient id={`shooterGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  {/* Main body */}
                  <path d="M25 10 L35 32 L25 28 L15 32 Z" fill={`url(#shooterGradient${alien.id})`} stroke="#1e40af" strokeWidth="2" />
                  {/* Weapon pods */}
                  <rect x="8" y="20" width="4" height="12" rx="1" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5" />
                  <rect x="38" y="20" width="4" height="12" rx="1" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5" />
                  {/* Gun barrels */}
                  <rect x="9" y="32" width="2" height="6" fill="#ef4444" />
                  <rect x="39" y="32" width="2" height="6" fill="#ef4444" />
                  {/* Cockpit */}
                  <circle cx="25" cy="18" r="4" fill="#1f2937" />
                  <circle cx="25" cy="18" r="3" fill="#3b82f6" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1s" repeatCount="indefinite" />
                  </circle>
                  {/* Engine */}
                  <circle cx="25" cy="30" r="2.5" fill="#60a5fa" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  {/* Weapon charge indicators */}
                  <circle cx="10" cy="26" r="1.5" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="40" cy="26" r="1.5" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              );

            case EnemyType.BOSS:
              // Boss enemy - Massive intimidating design
              return (
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <defs>
                    <linearGradient id={`bossGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#dc2626" />
                      <stop offset="50%" stopColor="#991b1b" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>
                    <radialGradient id={`bossGlow${alien.id}`}>
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Ominous glow */}
                  <circle cx="40" cy="40" r="38" fill={`url(#bossGlow${alien.id})`} opacity="0.3">
                    <animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Main hull */}
                  <ellipse cx="40" cy="35" rx="28" ry="20" fill={`url(#bossGradient${alien.id})`} stroke="#450a0a" strokeWidth="3" />
                  {/* Command bridge */}
                  <rect x="30" y="20" width="20" height="12" rx="2" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
                  {/* Side cannons */}
                  <rect x="8" y="28" width="8" height="16" rx="1" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
                  <rect x="64" y="28" width="8" height="16" rx="1" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
                  {/* Gun barrels */}
                  <rect x="6" y="44" width="4" height="10" fill="#374151" stroke="#1f2937" strokeWidth="1" />
                  <rect x="70" y="44" width="4" height="10" fill="#374151" stroke="#1f2937" strokeWidth="1" />
                  {/* Wings */}
                  <path d="M12 35 L5 30 L5 40 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
                  <path d="M68 35 L75 30 L75 40 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
                  {/* Cockpit */}
                  <circle cx="40" cy="26" r="6" fill="#1f2937" />
                  <circle cx="40" cy="26" r="4.5" fill="#ef4444" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  {/* Engine cores */}
                  <circle cx="28" cy="50" r="4" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="40" cy="52" r="4" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="52" cy="50" r="4" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="0.4s" repeatCount="indefinite" />
                  </circle>
                  {/* Armor plating details */}
                  <rect x="25" y="32" width="5" height="6" fill="#7f1d1d" opacity="0.5" />
                  <rect x="50" y="32" width="5" height="6" fill="#7f1d1d" opacity="0.5" />
                  {/* Weapon charge lights */}
                  <circle cx="10" cy="36" r="2" fill="#22d3ee" opacity="0.9">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="70" cy="36" r="2" fill="#22d3ee" opacity="0.9">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                </svg>
              );

            default:
              return null;
          }
        };

        return (
          <div key={alien.id}>
            <div
              className="alien"
              style={{ left: `${alien.x}%`, top: `${alien.y}%` }}
              role="img"
              aria-label={`${alien.type} enemy ship`}
            >
              {renderEnemyShip()}
            </div>

            {/* Boss Health Bar */}
            {alien.type === EnemyType.BOSS && (
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
                  BOSS: {alien.health}/{alien.maxHealth}
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
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
          {/* Retro Title */}
          <div className="text-center mb-12">
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
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-3 h-3 bg-green-400"></div>
              <div className="w-3 h-3 bg-green-400"></div>
              <div className="w-3 h-3 bg-green-400"></div>
            </div>
          </div>

          {/* Instructions Box - Retro Style */}
          <div className="retro-box mb-8 p-6 border-4 border-green-400 bg-black max-w-md">
            <h2 className="text-green-400 text-xl font-bold mb-4 text-center" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.15em'
            }}>
              CONTROLS
            </h2>
            <div className="text-green-400 space-y-2" style={{ fontFamily: 'monospace' }}>
              <div className="flex justify-between items-center border-b border-green-400/30 pb-2">
                <span>MOVE LEFT</span>
                <span className="font-bold">← or A</span>
              </div>
              <div className="flex justify-between items-center border-b border-green-400/30 pb-2">
                <span>MOVE RIGHT</span>
                <span className="font-bold">→ or D</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span>FIRE</span>
                <span className="font-bold">SPACE</span>
              </div>
            </div>
          </div>

          {/* Start Button - Retro Style */}
          <button
            onClick={startGame}
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

      {/* Game Over Screen - Retro Style */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
          <div className="retro-box border-4 border-red-500 bg-black p-12 max-w-lg">
            <h2 className="text-6xl font-bold text-red-500 mb-6 text-center" style={{
              fontFamily: 'monospace',
              letterSpacing: '0.2em'
            }}>
              GAME OVER
            </h2>
            
            <div className="border-4 border-red-500/50 bg-black p-6 mb-8">
              <div className="text-green-400 text-center mb-2" style={{ fontFamily: 'monospace' }}>
                FINAL SCORE
              </div>
              <div className="text-5xl font-bold text-green-400 text-center" style={{ fontFamily: 'monospace' }}>
                {score.toString().padStart(6, '0')}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full retro-button px-8 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.15em'
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
