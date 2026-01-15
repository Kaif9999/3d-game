'use client';
import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { getLeaderboard } from '@/lib/leaderboard';

interface LeaderboardProps {
  onBack?: () => void;
  compact?: boolean;
  maxEntries?: number;
}

export default function Leaderboard({ onBack, compact = false, maxEntries = 10 }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadLeaderboard = () => {
      const data = getLeaderboard();
      setEntries(data.slice(0, maxEntries));
    };

    loadLeaderboard();
  }, [maxEntries]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  if (compact) {
    // Compact view for start screen
    return (
      <div className="retro-box border-4 border-cyan-400 bg-black p-6 max-w-md w-full">
        <h2 
          className="text-cyan-400 text-2xl font-bold mb-4 text-center" 
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.15em'
          }}
        >
          TOP SCORES
        </h2>
        
        {entries.length === 0 ? (
          <div className="text-cyan-400/50 text-center py-4" style={{ fontFamily: 'monospace' }}>
            NO SCORES YET
          </div>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 5).map((entry, index) => (
              <div 
                key={entry.id}
                className="flex justify-between items-center border-b border-cyan-400/30 pb-2"
                style={{ fontFamily: 'monospace' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 font-bold w-6">#{index + 1}</span>
                  <span className="text-green-400">{entry.playerName}</span>
                </div>
                <span className="text-yellow-400 font-bold">{entry.score.toString().padStart(6, '0')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full leaderboard view
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
      <div className="retro-box border-4 border-cyan-400 bg-black p-8 max-w-3xl w-full">
        <h1 
          className="text-5xl font-bold text-cyan-400 mb-8 text-center" 
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}
        >
          LEADERBOARD
        </h1>

        {entries.length === 0 ? (
          <div className="text-cyan-400/50 text-center py-12 text-xl" style={{ fontFamily: 'monospace' }}>
            NO SCORES YET<br />
            BE THE FIRST TO PLAY!
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full" style={{ fontFamily: 'monospace' }}>
              <thead>
                <tr className="border-b-2 border-cyan-400">
                  <th className="text-cyan-400 text-left py-3 px-2">RANK</th>
                  <th className="text-cyan-400 text-left py-3 px-2">PLAYER</th>
                  <th className="text-cyan-400 text-right py-3 px-2">SCORE</th>
                  <th className="text-cyan-400 text-center py-3 px-2">WAVE</th>
                  <th className="text-cyan-400 text-right py-3 px-2">DATE</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr 
                    key={entry.id}
                    className="border-b border-cyan-400/30 hover:bg-cyan-400/10 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-orange-400' : 
                        'text-cyan-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="text-green-400 py-3 px-2">{entry.playerName}</td>
                    <td className="text-yellow-400 font-bold text-right py-3 px-2">
                      {entry.score.toString().padStart(6, '0')}
                    </td>
                    <td className="text-purple-400 text-center py-3 px-2">{entry.wave}</td>
                    <td className="text-cyan-400/70 text-right py-3 px-2 text-sm">
                      {formatDate(entry.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {onBack && (
          <button
            onClick={onBack}
            className="w-full mt-8 retro-button px-8 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
            style={{
              fontFamily: 'monospace',
              letterSpacing: '0.15em'
            }}
          >
            BACK TO MENU
          </button>
        )}
      </div>
    </div>
  );
}
