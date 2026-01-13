// src/lib/enemyUtils.ts

import { EnemyType } from './types';

export const getEnemySvg = (type: EnemyType): string => {
  switch (type) {
    case EnemyType.BASIC:
      return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
          <defs>
            <linearGradient id="alienGradientBasic" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ef4444" />
              <stop offset="50%" stop-color="#dc2626" />
              <stop offset="100%" stop-color="#991b1b" />
            </linearGradient>
          </defs>
          <path d="M25 8 L40 35 L25 30 L10 35 Z" fill="url(#alienGradientBasic)" stroke="#7f1d1d" stroke-width="2" />
          <circle cx="25" cy="18" r="4" fill="#1f2937" />
          <circle cx="25" cy="18" r="3" fill="#ef4444" opacity="0.7" />
        </svg>
      `;
    case EnemyType.FAST:
      return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
          <defs>
            <linearGradient id="alienGradientFast" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f97316" />
              <stop offset="100%" stop-color="#ea580c" />
            </linearGradient>
          </defs>
          <path d="M25 5 L45 45 L25 35 L5 45 Z" fill="url(#alienGradientFast)" stroke="#c2410c" stroke-width="2" />
          <path d="M25 15 L35 35 L25 30 L15 35 Z" fill="#fb923c" />
        </svg>
      `;
    case EnemyType.TANK:
      return `
        <svg viewBox="0 0 60 60" class="w-full h-full">
          <defs>
            <linearGradient id="alienGradientTank" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#71717a" />
              <stop offset="100%" stop-color="#52525b" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="40" height="40" rx="5" fill="url(#alienGradientTank)" stroke="#3f3f46" stroke-width="3" />
          <rect x="22" y="5" width="16" height="10" fill="#a1a1aa" />
          <circle cx="30" cy="30" r="8" fill="#dc2626" />
        </svg>
      `;
    case EnemyType.ZIGZAG:
      return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
          <defs>
            <linearGradient id="alienGradientZigzag" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#8b5cf6" />
              <stop offset="100%" stop-color="#7c3aed" />
            </linearGradient>
          </defs>
          <path d="M10 10 L40 25 L10 40 Z" fill="url(#alienGradientZigzag)" stroke="#6d28d9" stroke-width="2" />
          <path d="M40 10 L10 25 L40 40 Z" fill="url(#alienGradientZigzag)" stroke="#6d28d9" stroke-width="2" />
        </svg>
      `;
    case EnemyType.SHOOTER:
      return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
          <defs>
            <linearGradient id="alienGradientShooter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#14b8a6" />
              <stop offset="100%" stop-color="#0d9488" />
            </linearGradient>
          </defs>
          <circle cx="25" cy="25" r="20" fill="url(#alienGradientShooter)" stroke="#0f766e" stroke-width="3" />
          <circle cx="25" cy="25" r="10" fill="#000" />
          <path d="M25 5 L30 15 L20 15 Z" fill="#facc15" />
        </svg>
      `;
    case EnemyType.LEVEL_6:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <defs>
            <radialGradient id="grad6">
                <stop offset="0%" stop-color="#ff00ff" />
                <stop offset="100%" stop-color="#800080" />
            </radialGradient>
            </defs>
            <path d="M25,2 L48,25 L25,48 L2,25 Z" fill="url(#grad6)" stroke="black" stroke-width="2"/>
        </svg>
        `;
    case EnemyType.LEVEL_7:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <defs>
            <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00ffff" />
                <stop offset="100%" stop-color="#0000ff" />
            </linearGradient>
            </defs>
            <rect x="5" y="5" width="40" height="40" rx="10" fill="url(#grad7)" stroke="black" stroke-width="2"/>
            <rect x="15" y="15" width="20" height="20" rx="5" fill="white" />
        </svg>
        `;
    case EnemyType.LEVEL_8:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <path d="M10,10 L40,10 L25,40 Z" fill="orange" stroke="black" stroke-width="2"/>
            <path d="M10,40 L40,40 L25,10 Z" fill="yellow" stroke="black" stroke-width="2"/>
        </svg>
        `;
    case EnemyType.LEVEL_9:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <circle cx="25" cy="25" r="20" fill="black" stroke="white" stroke-width="2"/>
            <path d="M15,15 L35,35 M35,15 L15,35" stroke="red" stroke-width="4"/>
        </svg>
        `;
    case EnemyType.LEVEL_10:
        return `
        <svg viewBox="0 0 50 50" class="w-full h-full">
            <defs>
            <pattern id="patt10" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M0,0 L10,10 M10,0 L0,10" stroke="white" stroke-width="1"/>
            </pattern>
            </defs>
            <rect x="0" y="0" width="50" height="50" fill="url(#patt10)" />
        </svg>
        `;
    case EnemyType.BOSS:
      return `
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <defs>
            <linearGradient id="alienGradientBoss" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4c1d95" />
              <stop offset="100%" stop-color="#3730a3" />
            </linearGradient>
          </defs>
          <path d="M50 10 L90 50 L70 90 L30 90 L10 50 Z" fill="url(#alienGradientBoss)" stroke="#2e1065" stroke-width="4" />
          <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="#c4b5fd" />
          <circle cx="50" cy="20" r="8" fill="red" />
        </svg>
      `;
    default:
      return '';
  }
};
