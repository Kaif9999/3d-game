// src/lib/enemyUtils.ts
import { EnemyType } from './types';

export const getEnemySVG = (type: EnemyType) => {
  switch (type) {
    case EnemyType.LEVEL1:
      return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
          <path d="M25 10 L40 40 L10 40 Z" fill="#f0f" />
        </svg>
      `;
    case EnemyType.LEVEL2:
      return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
          <rect x="10" y="10" width="30" height="30" fill="#0ff" />
        </svg>
      `;
    case EnemyType.LEVEL3:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <circle cx="25" cy="25" r="20" fill="#ff0" />
        </svg>
        `;
    case EnemyType.LEVEL4:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <polygon points="25,10 40,40 10,40" fill="#f00" />
        </svg>
        `;
    case EnemyType.LEVEL5:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <path d="M10 10 H 40 V 40 H 10 Z" fill="#0f0" />
        </svg>
        `;
    case EnemyType.LEVEL6:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <path d="M25 10 L40 25 L25 40 L10 25 Z" fill="#00f" />
        </svg>
        `;
    case EnemyType.LEVEL7:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <path d="M10 10 C 20 40, 30 40, 40 10" fill="#f80" />
        </svg>
        `;
    case EnemyType.LEVEL8:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <path d="M10 25 C 20 10, 30 10, 40 25 C 30 40, 20 40, 10 25" fill="#80f" />
        </svg>
        `;
    case EnemyType.LEVEL9:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <path d="M25 10 L10 40 L40 40 Z" fill="#f08" />
        </svg>
        `;
    case EnemyType.LEVEL10:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <path d="M25 10 L15 20 L10 30 L15 40 L25 50 L35 40 L40 30 L35 20 Z" fill="#8f0" />
        </svg>
        `;
    case EnemyType.BOSS:
        return `
        <svg viewBox="0 0 100 100" class="w-full h-full">
            <path d="M50 10 L70 30 L60 40 L80 60 L70 70 L50 90 L30 70 L20 60 L40 40 L30 30 Z" fill="#f00" />
        </svg>
        `;
    default:
      return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
          <defs>
            <linearGradient id="alienGradientDefault" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
          <path
            d="M25 8 L40 35 L25 30 L10 35 Z"
            fill="url(#alienGradientDefault)"
            stroke="#7f1d1d"
            strokeWidth="2"
          />
          <circle cx="25" cy="18" r="4" fill="#1f2937" />
          <circle cx="25" cy="18" r="3" fill="#ef4444" opacity="0.7" />
        </svg>
      `;
  }
};
