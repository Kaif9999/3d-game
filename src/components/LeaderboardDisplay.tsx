'use client';
import { useEffect, useState } from 'react';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/leaderboard';

interface LeaderboardDisplayProps {
  maxEntries?: number;
  showHeader?: boolean;
  compact?: boolean;
}

export default function LeaderboardDisplay({
  maxEntries = 10,
  showHeader = true,
  compact = false
}: LeaderboardDisplayProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadEntries = () => {
      const leaderboard = getLeaderboard().slice(0, maxEntries);
      setEntries(leaderboard);
    };

    loadEntries();

    // Refresh leaderboard when localStorage changes
    const handleStorageChange = () => {
      loadEntries();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [maxEntries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-green-400/70 font-mono text-sm">
          No scores yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'retro-box border-4 border-green-400 bg-black p-6'}>
      {showHeader && (
        <h2 className="text-green-400 text-xl font-bold mb-4 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.15em'
        }}>
          LEADERBOARD
        </h2>
      )}

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between ${
              compact ? 'py-1' : 'py-2'
            } ${
              index < 3 ? 'border-2' : 'border'
            } ${
              index === 0 ? 'border-yellow-400 bg-yellow-400/10' :
              index === 1 ? 'border-gray-300 bg-gray-300/10' :
              index === 2 ? 'border-orange-600 bg-orange-600/10' :
              'border-green-400/30'
            } px-3`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className={`font-bold ${
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-300' :
                index === 2 ? 'text-orange-600' :
                'text-green-400'
              }`} style={{ fontFamily: 'monospace', minWidth: '20px' }}>
                #{index + 1}
              </span>

              <span className="text-green-400 font-mono truncate flex-1">
                {entry.playerName}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {!compact && (
                <span className="text-cyan-400 font-mono text-sm">
                  W{entry.wave}
                </span>
              )}

              <span className={`font-bold font-mono ${
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-300' :
                index === 2 ? 'text-orange-600' :
                'text-green-400'
              }`}>
                {entry.score.toString().padStart(6, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
