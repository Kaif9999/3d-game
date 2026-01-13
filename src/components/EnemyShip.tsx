import React from 'react';
import { EnemyType } from '@/lib/types';

interface EnemyShipProps {
  alien: {
    id: number;
    type: EnemyType;
  };
}

const EnemyShip: React.FC<EnemyShipProps> = ({ alien }) => {
  const { type } = alien;

  const renderEnemy = () => {
    switch (type) {
      case EnemyType.FAST:
        return (
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <defs>
              <linearGradient id={`alienGradientFast`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d="M25 5 L40 45 L25 35 L10 45 Z"
              fill="url(#alienGradientFast)"
              stroke="#b45309"
              strokeWidth="2"
            />
            <path
              d="M25 15 L35 40 L25 32 L15 40 Z"
              fill="url(#alienGradientFast)"
              stroke="#b45309"
              strokeWidth="1"
            />
          </svg>
        );
      case EnemyType.TANK:
        return (
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <defs>
              <linearGradient id={`alienGradientTank`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
            </defs>
            <rect
              x="10"
              y="10"
              width="30"
              height="30"
              rx="5"
              fill="url(#alienGradientTank)"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <rect
              x="15"
              y="5"
              width="20"
              height="40"
              rx="5"
              fill="url(#alienGradientTank)"
              stroke="#1f2937"
              strokeWidth="1.5"
            />
          </svg>
        );
      case EnemyType.ZIGZAG:
        return (
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <defs>
              <linearGradient id={`alienGradientZigzag`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
            <path
              d="M25 5 L45 25 L25 45 L5 25 Z"
              fill="url(#alienGradientZigzag)"
              stroke="#4c1d95"
              strokeWidth="2"
            />
            <path
              d="M25 15 L35 25 L25 35 L15 25 Z"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.5"
            />
          </svg>
        );
      case EnemyType.SHOOTER:
        return (
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <defs>
              <linearGradient id={`alienGradientShooter`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M10 10 L40 10 L45 25 L40 40 L10 40 L5 25 Z"
              fill="url(#alienGradientShooter)"
              stroke="#0891b2"
              strokeWidth="2"
            />
            <circle cx="25" cy="25" r="5" fill="#facc15" />
          </svg>
        );
      case EnemyType.BOSS:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="bossGradient">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#b91c1c" />
              </radialGradient>
            </defs>
            <path
              d="M50 10 L80 40 L70 90 L30 90 L20 40 Z"
              fill="url(#bossGradient)"
              stroke="#7f1d1d"
              strokeWidth="3"
            />
            <path
              d="M50 20 L70 45 L65 80 L35 80 L30 45 Z"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="2"
            />
            <circle cx="50" cy="55" r="10" fill="#fef08a" />
          </svg>
        );
      case EnemyType.BASIC:
      default:
        return (
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <defs>
              <linearGradient id={`alienGradientBasic`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <path
              d="M25 8 L40 35 L25 30 L10 35 Z"
              fill="url(#alienGradientBasic)"
              stroke="#7f1d1d"
              strokeWidth="2"
            />
            <path
              d="M10 20 L5 25 L10 28 Z"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            <path
              d="M40 20 L45 25 L40 28 Z"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
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
  };

  return <>{renderEnemy()}</>;
};

export default EnemyShip;
