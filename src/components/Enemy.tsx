import { EnemyType } from '@/lib/types';

interface EnemyProps {
  type: EnemyType;
  id: number;
}

export default function Enemy({ type, id }: EnemyProps) {
  switch (type) {
    case EnemyType.FAST:
      return (
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <defs>
            <linearGradient id={`alienGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
          <path
            d="M25 8 L40 35 L25 30 L10 35 Z"
            fill={`url(#alienGradient${id})`}
            stroke="#ca8a04"
            strokeWidth="2"
          />
          <path d="M10 20 L5 25 L10 28 Z" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
          <path d="M40 20 L45 25 L40 28 Z" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
          <circle cx="25" cy="18" r="4" fill="#1f2937" />
          <circle cx="25" cy="18" r="3" fill="#fde047" opacity="0.7">
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
    case EnemyType.TANK:
      return (
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <defs>
            <linearGradient id={`alienGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="40" height="40" rx="5" fill={`url(#alienGradient${id})`} stroke="#4b5563" strokeWidth="3" />
          <rect x="5" y="25" width="50" height="10" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />
          <circle cx="30" cy="20" r="5" fill="#1f2937" />
          <circle cx="30" cy="20" r="3" fill="#d1d5db" opacity="0.7" />
          <rect x="25" y="45" width="10" height="10" fill="#fbbf24" />
        </svg>
      );
    case EnemyType.ZIGZAG:
      return (
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <defs>
            <linearGradient id={`alienGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <path
            d="M25 10 L45 20 L25 30 L5 20 Z"
            fill={`url(#alienGradient${id})`}
            stroke="#4338ca"
            strokeWidth="2"
          />
           <path
            d="M25 25 L45 35 L25 45 L5 35 Z"
            fill={`url(#alienGradient${id})`}
            stroke="#4338ca"
            strokeWidth="2"
          />
          <circle cx="25" cy="15" r="3" fill="#1f2937" />
          <circle cx="25" cy="15" r="2" fill="#a5b4fc" opacity="0.7" />
        </svg>
      );
    case EnemyType.SHOOTER:
      return (
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <defs>
            <linearGradient id={`alienGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="50%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <circle cx="25" cy="25" r="20" fill={`url(#alienGradient${id})`} stroke="#dc2626" strokeWidth="3" />
          <circle cx="25" cy="25" r="10" fill="#1f2937" />
          <circle cx="25" cy="25" r="5" fill="#f87171" opacity="0.9" />
          <rect x="22.5" y="5" width="5" height="10" fill="#f87171" />
        </svg>
      );
    case EnemyType.BOSS:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id={`alienGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="50%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>
          <path d="M50 10 L90 50 L50 90 L10 50 Z" fill={`url(#alienGradient${id})`} stroke="#000" strokeWidth="4" />
          <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="#ef4444" />
          <circle cx="50" cy="50" r="10" fill="#111827" />
          <circle cx="50" cy="50" r="5" fill="#ef4444" opacity="0.9" />
          <rect x="10" y="45" width="80" height="10" fill="#4b5563" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <defs>
            <linearGradient id={`alienGradient${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
          <path
            d="M25 8 L40 35 L25 30 L10 35 Z"
            fill={`url(#alienGradient${id})`}
            stroke="#7f1d1d"
            strokeWidth="2"
          />
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
}
