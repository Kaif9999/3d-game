'use client';
import { EnemyType } from '@/lib/types';

interface EnemyShipProps {
  type: EnemyType;
  id: number;
}

export default function EnemyShip({ type, id }: EnemyShipProps) {
  // BASIC - Red standard enemy
  if (type === EnemyType.BASIC) {
    return (
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id={`alienGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>
        <path d="M25 8 L40 35 L25 30 L10 35 Z" fill={`url(#alienGradient${id})`} stroke="#7f1d1d" strokeWidth="2" />
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
  }

  // FAST - Orange/Yellow streamlined enemy
  if (type === EnemyType.FAST) {
    return (
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id={`fastGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Streamlined body */}
        <path d="M25 5 L35 38 L25 35 L15 38 Z" fill={`url(#fastGradient${id})`} stroke="#92400e" strokeWidth="2" />
        {/* Small wings */}
        <path d="M15 18 L10 22 L15 24 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
        <path d="M35 18 L40 22 L35 24 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
        {/* Cockpit */}
        <circle cx="25" cy="15" r="3" fill="#1f2937" />
        <circle cx="25" cy="15" r="2" fill="#fbbf24" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="0.5s" repeatCount="indefinite" />
        </circle>
        {/* Speed trails */}
        <line x1="25" y1="36" x2="25" y2="42" stroke="#fbbf24" strokeWidth="2" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.2s" repeatCount="indefinite" />
        </line>
      </svg>
    );
  }

  // TANK - Dark red/brown bulky enemy
  if (type === EnemyType.TANK) {
    return (
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id={`tankGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="50%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
        </defs>
        {/* Bulky body */}
        <path d="M25 10 L42 32 L25 28 L8 32 Z" fill={`url(#tankGradient${id})`} stroke="#450a0a" strokeWidth="3" />
        {/* Large wings */}
        <path d="M8 22 L2 28 L8 32 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
        <path d="M42 22 L48 28 L42 32 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
        {/* Armor plates */}
        <rect x="20" y="15" width="10" height="8" fill="#450a0a" stroke="#7f1d1d" strokeWidth="1" />
        {/* Cockpit */}
        <circle cx="25" cy="19" r="3" fill="#1f2937" />
        <circle cx="25" cy="19" r="2" fill="#7f1d1d" opacity="0.8" />
        {/* Heavy engines */}
        <circle cx="18" cy="30" r="2.5" fill="#dc2626" opacity="0.7">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="30" r="2.5" fill="#dc2626" opacity="0.7">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  }

  // ZIGZAG - Purple angular enemy
  if (type === EnemyType.ZIGZAG) {
    return (
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id={`zigzagGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#6b21a8" />
          </linearGradient>
        </defs>
        {/* Angular body */}
        <path d="M25 8 L35 20 L40 35 L25 30 L10 35 L15 20 Z" fill={`url(#zigzagGradient${id})`} stroke="#581c87" strokeWidth="2" />
        {/* Angular wings */}
        <path d="M15 18 L8 24 L12 28 Z" fill="#9333ea" stroke="#581c87" strokeWidth="1.5" />
        <path d="M35 18 L42 24 L38 28 Z" fill="#9333ea" stroke="#581c87" strokeWidth="1.5" />
        {/* Cockpit */}
        <polygon points="25,12 28,18 25,20 22,18" fill="#1f2937" />
        <circle cx="25" cy="16" r="2" fill="#a855f7" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="0.6s" repeatCount="indefinite" />
        </circle>
        {/* Energy trails */}
        <circle cx="18" cy="32" r="2" fill="#c084fc" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="2" fill="#c084fc" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.3s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  }

  // SHOOTER - Cyan enemy with visible guns
  if (type === EnemyType.SHOOTER) {
    return (
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id={`shooterGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#164e63" />
          </linearGradient>
        </defs>
        {/* Main body */}
        <path d="M25 8 L38 35 L25 30 L12 35 Z" fill={`url(#shooterGradient${id})`} stroke="#164e63" strokeWidth="2" />
        {/* Gun turrets */}
        <rect x="14" y="20" width="4" height="12" fill="#0891b2" stroke="#164e63" strokeWidth="1.5" />
        <rect x="32" y="20" width="4" height="12" fill="#0891b2" stroke="#164e63" strokeWidth="1.5" />
        {/* Gun barrels */}
        <rect x="15" y="32" width="2" height="6" fill="#164e63" />
        <rect x="33" y="32" width="2" height="6" fill="#164e63" />
        {/* Wings */}
        <path d="M12 22 L6 26 L12 30 Z" fill="#0891b2" stroke="#164e63" strokeWidth="1.5" />
        <path d="M38 22 L44 26 L38 30 Z" fill="#0891b2" stroke="#164e63" strokeWidth="1.5" />
        {/* Cockpit */}
        <circle cx="25" cy="18" r="4" fill="#1f2937" />
        <circle cx="25" cy="18" r="3" fill="#06b6d4" opacity="0.7">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="0.8s" repeatCount="indefinite" />
        </circle>
        {/* Targeting lights */}
        <circle cx="16" cy="26" r="1.5" fill="#ef4444" opacity="0.9">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="34" cy="26" r="1.5" fill="#ef4444" opacity="0.9">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  }

  // BOSS - Large imposing enemy
  if (type === EnemyType.BOSS) {
    return (
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <defs>
          <linearGradient id={`bossGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <radialGradient id={`bossGlow${id}`}>
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Glow effect */}
        <circle cx="25" cy="25" r="24" fill={`url(#bossGlow${id})`} opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Main body */}
        <path d="M25 5 L45 30 L40 40 L25 35 L10 40 L5 30 Z" fill={`url(#bossGradient${id})`} stroke="#450a0a" strokeWidth="3" />
        {/* Large wings */}
        <path d="M5 20 L0 28 L5 35 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
        <path d="M45 20 L50 28 L45 35 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
        {/* Armor sections */}
        <rect x="18" y="12" width="14" height="10" fill="#450a0a" stroke="#dc2626" strokeWidth="1.5" />
        <rect x="20" y="22" width="10" height="8" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" />
        {/* Main cockpit */}
        <circle cx="25" cy="17" r="5" fill="#1f2937" stroke="#dc2626" strokeWidth="2" />
        <circle cx="25" cy="17" r="4" fill="#dc2626" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Multiple engines */}
        <circle cx="15" cy="37" r="3" fill="#fbbf24" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="25" cy="37" r="3" fill="#fbbf24" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="35" cy="37" r="3" fill="#fbbf24" opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="0.3s" repeatCount="indefinite" />
        </circle>
        {/* Weapon systems */}
        <rect x="10" y="25" width="3" height="8" fill="#dc2626" stroke="#450a0a" strokeWidth="1" />
        <rect x="37" y="25" width="3" height="8" fill="#dc2626" stroke="#450a0a" strokeWidth="1" />
      </svg>
    );
  }

  // Fallback
  return null;
}
