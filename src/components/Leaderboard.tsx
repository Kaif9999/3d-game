'use client';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onBack?: () => void;
  compact?: boolean;
  maxEntries?: number;
}

export default function Leaderboard({ entries, onBack, compact = false, maxEntries }: LeaderboardProps) {
  const displayEntries = maxEntries ? entries.slice(0, maxEntries) : entries;
  const hasEntries = displayEntries.length > 0;

  if (compact) {
    // Compact view for start screen
    return (
      <div className="retro-box border-4 border-cyan-400 bg-black p-4 w-full max-w-md">
        <h3 className="text-cyan-400 text-lg font-bold mb-3 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.15em'
        }}>
          TOP SCORES
        </h3>
        
        {hasEntries ? (
          <div className="space-y-1">
            {displayEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex justify-between items-center text-cyan-400 text-sm border-b border-cyan-400/30 pb-1"
                style={{ fontFamily: 'monospace' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold w-6">#{index + 1}</span>
                  <span className="truncate max-w-[120px]">{entry.playerName}</span>
                </div>
                <span className="font-bold">{entry.score.toString().padStart(6, '0')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-cyan-400/50 text-center text-sm" style={{ fontFamily: 'monospace' }}>
            NO SCORES YET
          </div>
        )}
      </div>
    );
  }

  // Full leaderboard view
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
      <div className="retro-box border-4 border-cyan-400 bg-black p-8 max-w-2xl w-full">
        <h2 className="text-5xl font-bold text-cyan-400 mb-8 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          LEADERBOARD
        </h2>

        {hasEntries ? (
          <div className="space-y-2 mb-8 max-h-[400px] overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 text-cyan-400 font-bold text-sm border-b-2 border-cyan-400 pb-2" style={{ fontFamily: 'monospace' }}>
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-4">PLAYER</div>
              <div className="col-span-3 text-right">SCORE</div>
              <div className="col-span-2 text-center">WAVE</div>
              <div className="col-span-2 text-right">DATE</div>
            </div>

            {/* Entries */}
            {displayEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`grid grid-cols-12 gap-2 text-cyan-400 text-sm py-2 border-b border-cyan-400/30 ${
                  index < 3 ? 'bg-cyan-400/10' : ''
                }`}
                style={{ fontFamily: 'monospace' }}
              >
                <div className="col-span-1 text-center">
                  <span className={`font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-orange-400' :
                    'text-cyan-400'
                  }`}>
                    #{index + 1}
                  </span>
                </div>
                <div className="col-span-4 truncate">{entry.playerName}</div>
                <div className="col-span-3 text-right font-bold">{entry.score.toString().padStart(6, '0')}</div>
                <div className="col-span-2 text-center">{entry.wave}</div>
                <div className="col-span-2 text-right text-xs">{entry.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-cyan-400/50 text-center text-xl mb-8 py-12" style={{ fontFamily: 'monospace' }}>
            NO SCORES YET<br />
            <span className="text-sm">BE THE FIRST TO PLAY!</span>
          </div>
        )}

        {onBack && (
          <button
            onClick={onBack}
            className="w-full retro-button px-8 py-4 border-4 border-cyan-400 bg-black text-cyan-400 font-bold text-xl hover:bg-cyan-400 hover:text-black transition-all"
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
