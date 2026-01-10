'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import audioManager from '@/utils/audioManager';

// Constants
const MAX_PARTICLES = 200;
const MAX_STARS = 100;

// Enemy types
enum EnemyType {
  BASIC = 'basic',
  FAST = 'fast',
  TANK = 'tank',
  ZIGZAG = 'zigzag',
  SHOOTER = 'shooter',
  BOSS = 'boss'
}

// Power-up types
enum PowerUpType {
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

interface Alien {
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

interface Bullet {
  id: number;
  x: number;
  y: number;
  isPlayerBullet: boolean;
  damage?: number;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
  speed: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

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
  const [lives, setLives] = useState(3);
  const [playerX, setPlayerX] = useState(50);
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
  const [activePowerUps, setActivePowerUps] = useState<{
    doubleShot: number;
    tripleShot: number;
    shield: number;
    speedBoost: number;
    rapidFire: number;
    laserBeam: number;
    homingMissile: number;
    timeSlow: number;
    scoreMultiplier: number;
  }>({
    doubleShot: 0,
    tripleShot: 0,
    shield: 0,
    speedBoost: 0,
    rapidFire: 0,
    laserBeam: 0,
    homingMissile: 0,
    timeSlow: 0,
    scoreMultiplier: 0
  });
  
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const alienIdCounter = useRef(0);
  const bulletIdCounter = useRef(0);
  const explosionIdCounter = useRef(0);
  const starIdCounter = useRef(0);
  const particleIdCounter = useRef(0);
  const powerUpIdCounter = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastAlienSpawnRef = useRef(0);
  const lastFireTime = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const screenShakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFrameTime = useRef(0);
  
  // Mobile touch controls
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  
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
      if (combined.length > MAX_PARTICLES) {
        return combined.slice(-MAX_PARTICLES);
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
    if (Math.random() < 0.25) { // 25% chance (increased from 20%)
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
  
  // Helper function to get power-up color
  const getPowerUpColor = (type: PowerUpType): string => {
    switch (type) {
      case PowerUpType.DOUBLE_SHOT: return '#3b82f6'; // blue
      case PowerUpType.TRIPLE_SHOT: return '#a855f7'; // purple
      case PowerUpType.SHIELD: return '#22d3ee'; // cyan
      case PowerUpType.SPEED_BOOST: return '#fbbf24'; // yellow
      case PowerUpType.RAPID_FIRE: return '#ef4444'; // red
      case PowerUpType.LASER_BEAM: return '#10b981'; // green
      case PowerUpType.HOMING_MISSILE: return '#f97316'; // orange
      case PowerUpType.TIME_SLOW: return '#8b5cf6'; // violet
      case PowerUpType.SCORE_MULTIPLIER: return '#f59e0b'; // amber
      case PowerUpType.EXTRA_LIFE: return '#ec4899'; // pink
      default: return '#ffffff';
    }
  };
  
  // Helper function to get power-up icon
  const getPowerUpIcon = (type: PowerUpType): string => {
    switch (type) {
      case PowerUpType.DOUBLE_SHOT: return '⚡⚡';
      case PowerUpType.TRIPLE_SHOT: return '⚡⚡⚡';
      case PowerUpType.SHIELD: return '🛡️';
      case PowerUpType.SPEED_BOOST: return '⚡';
      case PowerUpType.RAPID_FIRE: return '🔥';
      case PowerUpType.LASER_BEAM: return '🔆';
      case PowerUpType.HOMING_MISSILE: return '🎯';
      case PowerUpType.TIME_SLOW: return '⏱️';
      case PowerUpType.SCORE_MULTIPLIER: return '✨';
      case PowerUpType.EXTRA_LIFE: return '❤️';
      default: return '?';
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
        const fireDelay = activePowerUps.rapidFire > 0 ? 100 : 200;
        
        if (now - lastFireTime.current > fireDelay) {
          lastFireTime.current = now;
          
          // Fire bullets based on active power-ups
          const newBullets: Bullet[] = [];
          
          if (activePowerUps.tripleShot > 0) {
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

  // Mobile touch controls
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!gameStarted || gameOver || gamePaused) return;
      
      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
      setIsTouching(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!gameStarted || gameOver || gamePaused || touchStartX === null) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const sensitivity = 0.15;
      
      setPlayerX(prev => {
        const newX = prev + deltaX * sensitivity;
        return Math.max(5, Math.min(95, newX));
      });
      
      setTouchStartX(touch.clientX);
    };

    const handleTouchEnd = () => {
      setTouchStartX(null);
      setIsTouching(false);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameStarted, gameOver, gamePaused, touchStartX]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || gamePaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const gameLoop = (currentTime: number) => {
      // Calculate delta time for consistent gameplay
      if (!lastFrameTime.current) lastFrameTime.current = currentTime;
      const deltaTime = currentTime - lastFrameTime.current;
      
      // Time slow power-up increases frame delay
      const timeSlowMultiplier = activePowerUps.timeSlow > Date.now() ? 1.5 : 1;
      const targetFrameTime = 50 * timeSlowMultiplier;
      
      // Target 60 FPS (16.67ms per frame), but run game logic at ~20 FPS (50ms)
      if (deltaTime < targetFrameTime) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      lastFrameTime.current = currentTime;
      // Move player with speed boost
      setPlayerX(prev => {
        let newX = prev;
        const speed = activePowerUps.speedBoost > 0 ? 2.5 : 1.5;
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
      setBullets(prev => prev.map(bullet => ({
        ...bullet,
        y: bullet.isPlayerBullet ? bullet.y - 2 : bullet.y + 1.5,
      })).filter(bullet => bullet.isPlayerBullet ? bullet.y > -5 : bullet.y < 105));

      // Move aliens with different patterns
      setAliens(prev => prev.map(alien => {
        let newX = alien.x;
        let newY = alien.y + alien.speed;
        
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
              
              // Update score with combo and multiplier
              const now = Date.now();
              if (now - lastKillTime < 1000) {
                setCombo(prev => prev + 1);
              } else {
                setCombo(1);
              }
              setLastKillTime(now);
              
              const comboMultiplier = 1 + combo * 0.1;
              const scoreMultiplier = activePowerUps.scoreMultiplier > Date.now() ? 2 : 1;
              const points = stats.points * comboMultiplier * scoreMultiplier;
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
        if (distance < 4) {
          powerUpsToRemove.add(powerUp.id);
          
          // Apply power-up effect
          if (powerUp.type === PowerUpType.EXTRA_LIFE) {
            // Extra life gives immediate life
            setLives(prev => Math.min(prev + 1, 5)); // Max 5 lives
            createParticles(powerUp.x, powerUp.y, 12, '#ec4899');
          } else {
            setActivePowerUps(prev => ({
              ...prev,
              [powerUp.type]: Date.now() + 10000 // 10 seconds duration
            }));
            createParticles(powerUp.x, powerUp.y, 8, getPowerUpColor(powerUp.type));
          }
          
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
        return {
          doubleShot: prev.doubleShot > now ? prev.doubleShot : 0,
          tripleShot: prev.tripleShot > now ? prev.tripleShot : 0,
          shield: prev.shield > now ? prev.shield : 0,
          speedBoost: prev.speedBoost > now ? prev.speedBoost : 0,
          rapidFire: prev.rapidFire > now ? prev.rapidFire : 0,
          laserBeam: prev.laserBeam > now ? prev.laserBeam : 0,
          homingMissile: prev.homingMissile > now ? prev.homingMissile : 0,
          timeSlow: prev.timeSlow > now ? prev.timeSlow : 0,
          scoreMultiplier: prev.scoreMultiplier > now ? prev.scoreMultiplier : 0
        };
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
        setWave(prev => prev + 1);
        createParticles(50, 50, 20, '#22d3ee');
      }
      
      // Continue the loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      lastFrameTime.current = 0;
    };
  }, [gameStarted, gameOver, gamePaused, score, playerX, wave, combo, highScore, activePowerUps, lastKillTime]);

  const startGame = async () => {
    // Initialize audio on user interaction
    await audioManager.initializeOnUserInteraction();
    
    setGameStarted(true);
    setGameOver(false);
    setGamePaused(false);
    setScore(0);
    setLives(3);
    setPlayerX(50);
    setAliens([]);
    setBullets([]);
    setPowerUps([]);
    setExplosions([]);
    setParticles([]);
    setWave(1);
    setCombo(0);
    setLastKillTime(0);
    setScreenShake(0);
    setActivePowerUps({
      doubleShot: 0,
      tripleShot: 0,
      shield: 0,
      speedBoost: 0,
      rapidFire: 0,
      laserBeam: 0,
      homingMissile: 0,
      timeSlow: 0,
      scoreMultiplier: 0
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
    setLives(3);
    setPlayerX(50);
    setAliens([]);
    setBullets([]);
    setPowerUps([]);
    setExplosions([]);
    setParticles([]);
    setWave(1);
    setCombo(0);
    setLastKillTime(0);
    setScreenShake(0);
    setActivePowerUps({
      doubleShot: 0,
      tripleShot: 0,
      shield: 0,
      speedBoost: 0,
      rapidFire: 0,
      laserBeam: 0,
      homingMissile: 0,
      timeSlow: 0,
      scoreMultiplier: 0
    });
  };

  return (
    <div 
      ref={gameContainerRef}
      className="game-container bg-gradient-to-b from-black via-gray-900 to-black"
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
            {[...Array(Math.max(3, lives))].map((_, i) => (
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
            >
              {isMuted ? 'UNMUTE' : 'MUTE'}
            </button>
          </div>
          
          <div className="flex gap-4 items-center">
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
            <div className="px-2 py-1 bg-blue-500 text-white font-mono text-xs rounded">
              ⚡⚡ {Math.ceil((activePowerUps.doubleShot - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.tripleShot > Date.now() && (
            <div className="px-2 py-1 bg-purple-500 text-white font-mono text-xs rounded">
              ⚡⚡⚡ {Math.ceil((activePowerUps.tripleShot - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.shield > Date.now() && (
            <div className="px-2 py-1 bg-cyan-500 text-white font-mono text-xs rounded">
              🛡️ {Math.ceil((activePowerUps.shield - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.speedBoost > Date.now() && (
            <div className="px-2 py-1 bg-yellow-500 text-white font-mono text-xs rounded">
              ⚡ {Math.ceil((activePowerUps.speedBoost - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.rapidFire > Date.now() && (
            <div className="px-2 py-1 bg-red-500 text-white font-mono text-xs rounded">
              🔥 {Math.ceil((activePowerUps.rapidFire - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.laserBeam > Date.now() && (
            <div className="px-2 py-1 bg-green-500 text-white font-mono text-xs rounded">
              🔆 {Math.ceil((activePowerUps.laserBeam - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.homingMissile > Date.now() && (
            <div className="px-2 py-1 bg-orange-500 text-white font-mono text-xs rounded">
              🎯 {Math.ceil((activePowerUps.homingMissile - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.timeSlow > Date.now() && (
            <div className="px-2 py-1 bg-violet-500 text-white font-mono text-xs rounded">
              ⏱️ {Math.ceil((activePowerUps.timeSlow - Date.now()) / 1000)}s
            </div>
          )}
          {activePowerUps.scoreMultiplier > Date.now() && (
            <div className="px-2 py-1 bg-amber-500 text-white font-mono text-xs rounded">
              ✨ 2x {Math.ceil((activePowerUps.scoreMultiplier - Date.now()) / 1000)}s
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

      {/* Aliens - Larger Red Enemy Ships */}
      {gameStarted && !gameOver && aliens.map((alien) => (
        <div
          key={alien.id}
          className="alien"
          style={{ left: `${alien.x}%`, top: `${alien.y}%` }}
        >
          {/* Boss Health Bar */}
          {alien.type === EnemyType.BOSS && (
            <div 
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32"
              style={{ zIndex: 100 }}
            >
              <div className="bg-gray-800 h-2 rounded-full border border-red-500">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-200"
                  style={{ 
                    width: `${(alien.health / alien.maxHealth) * 100}%`,
                    boxShadow: '0 0 10px #ef4444'
                  }}
                />
              </div>
              <div className="text-center text-xs text-red-400 font-mono mt-1">
                BOSS: {alien.health}/{alien.maxHealth}
              </div>
            </div>
          )}
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <defs>
              <linearGradient id={`alienGradient${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            {/* Main body - inverted triangle */}
            <path
              d="M25 8 L40 35 L25 30 L10 35 Z"
              fill={`url(#alienGradient${alien.id})`}
              stroke="#7f1d1d"
              strokeWidth="2"
            />
            {/* Left wing */}
            <path
              d="M10 20 L5 25 L10 28 Z"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            {/* Right wing */}
            <path
              d="M40 20 L45 25 L40 28 Z"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            {/* Cockpit */}
            <circle cx="25" cy="18" r="4" fill="#1f2937" />
            <circle cx="25" cy="18" r="3" fill="#ef4444" opacity="0.7">
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Engine exhausts */}
            <circle cx="18" cy="32" r="2" fill="#fbbf24" opacity="0.8">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="32" cy="32" r="2" fill="#fbbf24" opacity="0.8">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      ))}

      {/* Bullets - Small Red Lasers */}
      {gameStarted && !gameOver && bullets.map((bullet) => (
        <div
          key={bullet.id}
          className="bullet"
          style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
        />
      ))}

      {/* Power-ups */}
      {gameStarted && !gameOver && powerUps.map((powerUp) => (
        <div
          key={powerUp.id}
          className="absolute transition-all duration-100"
          style={{ 
            left: `${powerUp.x}%`, 
            top: `${powerUp.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'spin 2s linear infinite'
          }}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xl"
            style={{
              backgroundColor: getPowerUpColor(powerUp.type),
              boxShadow: `0 0 20px ${getPowerUpColor(powerUp.type)}`,
              border: '2px solid white'
            }}
          >
            {getPowerUpIcon(powerUp.type)}
          </div>
        </div>
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
          >
            START GAME
          </button>

          {/* Retro decoration */}
          <div className="mt-8 text-green-400/50 text-xs" style={{ fontFamily: 'monospace' }}>
            © 1982 CLASSIC ARCADE
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {gameStarted && !gameOver && !gamePaused && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 z-20 md:hidden">
          {/* Fire Button */}
          <button
            onTouchStart={async (e) => {
              e.preventDefault();
              await audioManager.initializeOnUserInteraction();
              
              const now = Date.now();
              const fireDelay = activePowerUps.rapidFire > 0 ? 100 : 200;
              
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
            }}
            className="w-20 h-20 rounded-full bg-red-500 border-4 border-red-300 text-white font-bold text-2xl active:bg-red-600 active:scale-95 transition-all"
            style={{ 
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
              touchAction: 'none'
            }}
          >
            🔥
          </button>
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
