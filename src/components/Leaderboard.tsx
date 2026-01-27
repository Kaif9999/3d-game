'use client';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentPlayerName?: string;
  highlightScore?: number;
}

export default function Leaderboard({ entries, currentPlayerName, highlightScore }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="retro-box border-4 border-green-400 bg-black p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.15em'
        }}>
          LEADERBOARD
        </h3>
        <p className="text-green-400/70 text-center font-mono text-sm">
          No scores yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="retro-box border-4 border-green-400 bg-black p-4 sm:p-6 w-full max-w-md">
      <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 text-center" style={{
        fontFamily: 'monospace',
        letterSpacing: '0.15em'
      }}>
        LEADERBOARD
      </h3>
      
      <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
        {entries.map((entry, index) => {
          const isCurrentPlayer = entry.name === currentPlayerName;
          const isHighlighted = highlightScore !== undefined && entry.score === highlightScore;
          const rankColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-green-400';
          
          return (
            <div
              key={`${entry.name}-${entry.score}-${index}`}
              className={`flex items-center justify-between p-2 sm:p-3 border-2 ${
                isHighlighted ? 'border-cyan-400 bg-cyan-400/10' : 'border-green-400/30'
              } ${isCurrentPlayer ? 'bg-green-400/10' : ''}`}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className={`font-bold font-mono text-base sm:text-lg ${rankColor} w-6 sm:w-8 flex-shrink-0`}>
                  #{index + 1}
                </span>
                <span className="text-green-400 font-mono text-sm sm:text-base truncate flex-1">
                  {entry.name}
                  {isCurrentPlayer && <span className="text-cyan-400 ml-1">(YOU)</span>}
                </span>
              </div>
              
              <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                <span className="text-green-400 font-mono font-bold text-sm sm:text-base">
                  {entry.score.toString().padStart(6, '0')}
                </span>
                <span className="text-green-400/50 font-mono text-xs">
                  LVL {entry.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {currentPlayerName && (
        <div className="mt-4 pt-4 border-t-2 border-green-400/30">
          <div className="text-center">
            <p className="text-green-400/70 font-mono text-xs sm:text-sm mb-1">
              YOUR BEST
            </p>
            <p className="text-cyan-400 font-mono font-bold text-lg sm:text-xl">
              {entries.find(e => e.name === currentPlayerName)?.score.toString().padStart(6, '0') || '000000'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
