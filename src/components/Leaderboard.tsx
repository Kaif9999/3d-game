'use client';
import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { getTopScores, formatDate } from '@/lib/leaderboard';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getTopScores(10));
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="retro-title text-6xl font-bold mb-4 text-green-400" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          LEADERBOARD
        </h1>
        <div className="flex justify-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-400"></div>
          <div className="w-3 h-3 bg-green-400"></div>
          <div className="w-3 h-3 bg-green-400"></div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="retro-box border-4 border-green-400 bg-black p-6 max-w-4xl w-full mb-8">
        {entries.length === 0 ? (
          <div className="text-center text-green-400 py-12" style={{ fontFamily: 'monospace' }}>
            <p className="text-2xl mb-2">NO SCORES YET</p>
            <p className="text-sm opacity-70">Be the first to play!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-green-400" style={{ fontFamily: 'monospace' }}>
              <thead>
                <tr className="border-b-2 border-green-400">
                  <th className="text-left py-3 px-2 text-sm">RANK</th>
                  <th className="text-left py-3 px-4 text-sm">PLAYER</th>
                  <th className="text-right py-3 px-4 text-sm">SCORE</th>
                  <th className="text-center py-3 px-4 text-sm">WAVE</th>
                  <th className="text-right py-3 px-2 text-sm">DATE</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    className={`border-b border-green-400/30 hover:bg-green-400/10 transition-colors ${
                      index === 0 ? 'text-yellow-400' : 
                      index === 1 ? 'text-gray-300' : 
                      index === 2 ? 'text-orange-400' : 
                      'text-green-400'
                    }`}
                  >
                    <td className="py-3 px-2 font-bold">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td className="py-3 px-4 truncate max-w-[200px]">
                      {entry.playerName}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {entry.score.toString().padStart(6, '0')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {entry.wave}
                    </td>
                    <td className="py-3 px-2 text-right text-xs opacity-70">
                      {formatDate(entry.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="retro-button px-12 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
        style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em'
        }}
        aria-label="Back to main menu"
      >
        BACK TO MENU
      </button>

      {/* Retro decoration */}
      <div className="mt-8 text-green-400/50 text-xs" style={{ fontFamily: 'monospace' }}>
        © 1982 CLASSIC ARCADE
      </div>
    </div>
  );
}
