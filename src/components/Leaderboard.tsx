'use client';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  maxEntries?: number;
  highlightScore?: number;
  showTitle?: boolean;
}

export default function Leaderboard({ 
  entries, 
  maxEntries = 10, 
  highlightScore,
  showTitle = true 
}: LeaderboardProps) {
  const displayEntries = entries.slice(0, maxEntries);

  if (displayEntries.length === 0) {
    return (
      <div className="retro-box border-4 border-green-400 bg-black p-6">
        {showTitle && (
          <h2 
            className="text-green-400 text-2xl font-bold mb-4 text-center" 
            style={{
              fontFamily: 'monospace',
              letterSpacing: '0.15em'
            }}
          >
            LEADERBOARD
          </h2>
        )}
        <div 
          className="text-green-400/70 text-center py-8" 
          style={{ fontFamily: 'monospace' }}
        >
          NO SCORES YET
        </div>
      </div>
    );
  }

  return (
    <div className="retro-box border-4 border-green-400 bg-black p-6">
      {showTitle && (
        <h2 
          className="text-green-400 text-2xl font-bold mb-4 text-center" 
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.15em'
          }}
        >
          LEADERBOARD
        </h2>
      )}
      
      <div className="space-y-2">
        {/* Header */}
        <div 
          className="grid grid-cols-12 gap-2 text-green-400 text-sm border-b-2 border-green-400/50 pb-2"
          style={{ fontFamily: 'monospace' }}
        >
          <div className="col-span-2 text-center">RANK</div>
          <div className="col-span-5">PLAYER</div>
          <div className="col-span-3 text-right">SCORE</div>
          <div className="col-span-2 text-center">WAVE</div>
        </div>

        {/* Entries */}
        {displayEntries.map((entry, index) => {
          const isHighlighted = highlightScore !== undefined && entry.score === highlightScore;
          const rankColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-green-400';
          
          return (
            <div
              key={`${entry.playerName}-${entry.score}-${entry.date}-${index}`}
              className={`grid grid-cols-12 gap-2 py-2 border-b border-green-400/20 ${
                isHighlighted ? 'bg-green-400/20 animate-pulse' : ''
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              <div className={`col-span-2 text-center font-bold ${rankColor}`}>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>
              <div className={`col-span-5 truncate ${isHighlighted ? 'text-yellow-400 font-bold' : 'text-green-400'}`}>
                {entry.playerName}
              </div>
              <div className={`col-span-3 text-right ${isHighlighted ? 'text-yellow-400 font-bold' : 'text-green-400'}`}>
                {entry.score.toString().padStart(6, '0')}
              </div>
              <div className={`col-span-2 text-center ${isHighlighted ? 'text-yellow-400' : 'text-green-400/70'}`}>
                {entry.wave}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div 
        className="text-green-400/50 text-xs text-center mt-4 pt-4 border-t border-green-400/30"
        style={{ fontFamily: 'monospace' }}
      >
        TOP {maxEntries} SCORES
      </div>
    </div>
  );
}
