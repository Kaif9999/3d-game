// Power-up utility functions to handle enum to state key conversion

import { PowerUpType } from './types';

// Map PowerUpType enum values to activePowerUps state keys
export const powerUpTypeToStateKey = (type: PowerUpType): string => {
  const mapping: Record<PowerUpType, string> = {
    [PowerUpType.DOUBLE_SHOT]: 'doubleShot',
    [PowerUpType.TRIPLE_SHOT]: 'tripleShot',
    [PowerUpType.SHIELD]: 'shield',
    [PowerUpType.SPEED_BOOST]: 'speedBoost',
    [PowerUpType.RAPID_FIRE]: 'rapidFire',
    [PowerUpType.LASER_BEAM]: 'laserBeam',
    [PowerUpType.HOMING_MISSILE]: 'homingMissile',
    [PowerUpType.TIME_SLOW]: 'timeSlow',
    [PowerUpType.SCORE_MULTIPLIER]: 'scoreMultiplier',
    [PowerUpType.EXTRA_LIFE]: 'extraLife'
  };

  return mapping[type] || '';
};

// Get power-up display name
export const getPowerUpDisplayName = (type: PowerUpType): string => {
  const names: Record<PowerUpType, string> = {
    [PowerUpType.DOUBLE_SHOT]: 'Double Shot',
    [PowerUpType.TRIPLE_SHOT]: 'Triple Shot',
    [PowerUpType.SHIELD]: 'Shield',
    [PowerUpType.SPEED_BOOST]: 'Speed Boost',
    [PowerUpType.RAPID_FIRE]: 'Rapid Fire',
    [PowerUpType.LASER_BEAM]: 'Laser Beam',
    [PowerUpType.HOMING_MISSILE]: 'Homing Missile',
    [PowerUpType.TIME_SLOW]: 'Time Slow',
    [PowerUpType.SCORE_MULTIPLIER]: 'Score Multiplier',
    [PowerUpType.EXTRA_LIFE]: 'Extra Life'
  };

  return names[type] || 'Unknown';
};

// Get power-up color for UI display
export const getPowerUpColor = (type: PowerUpType): string => {
  const colors: Record<PowerUpType, string> = {
    [PowerUpType.DOUBLE_SHOT]: 'text-blue-400',
    [PowerUpType.TRIPLE_SHOT]: 'text-cyan-400',
    [PowerUpType.SHIELD]: 'text-purple-400',
    [PowerUpType.SPEED_BOOST]: 'text-yellow-400',
    [PowerUpType.RAPID_FIRE]: 'text-red-400',
    [PowerUpType.LASER_BEAM]: 'text-green-400',
    [PowerUpType.HOMING_MISSILE]: 'text-orange-400',
    [PowerUpType.TIME_SLOW]: 'text-indigo-400',
    [PowerUpType.SCORE_MULTIPLIER]: 'text-pink-400',
    [PowerUpType.EXTRA_LIFE]: 'text-emerald-400'
  };

  return colors[type] || 'text-gray-400';
};
