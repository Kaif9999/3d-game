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
      <div className="retro-box border-4 border-green-400 bg-black p-4 md:p-6 max-w-md w-full">
        <h3 
          className="text-2xl md:text-3xl font-bold text-green-400 mb-4 text-center" 
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          LEADERBOARD
        </h3>
        <p className="text-green-400/70 text-center font-mono text-sm">
          No scores yet. Be the first!
        </p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="retro-box border-4 border-green-400 bg-black p-4 md:p-6 max-w-md w-full">
      <h3 
        className="text-2xl md:text-3xl font-bold text-green-400 mb-4 text-center" 
        style={{
          fontFamily: 'monospace',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}
      >
        LEADERBOARD
      </h3>
      
      <div className="space-y-2">
        {entries.map((entry, index) => {
          const isCurrentPlayer = entry.name === currentPlayerName;
          const isHighlighted = highlightScore !== undefined && entry.score === highlightScore;
          const borderColor = isHighlighted ? 'border-yellow-400' : isCurrentPlayer ? 'border-cyan-400' : 'border-green-400/30';
          const textColor = isHighlighted ? 'text-yellow-400' : isCurrentPlayer ? 'text-cyan-400' : 'text-green-400';
          
          return (
            <div
              key={`${entry.name}-${entry.timestamp}-${index}`}
              className={`border-2 ${borderColor} bg-black/50 p-2 md:p-3 transition-all ${isHighlighted ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <span 
                    className={`${textColor} font-mono font-bold text-base md:text-lg flex-shrink-0`}
                    style={{ letterSpacing: '0.1em' }}
                  >
                    #{index + 1}
                  </span>
                  <span 
                    className={`${textColor} font-mono text-sm md:text-base truncate flex-1`}
                    style={{ letterSpacing: '0.05em' }}
                    title={entry.name}
                  >
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <span 
                    className={`${textColor} font-mono font-bold text-sm md:text-base`}
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {entry.score.toString().padStart(6, '0')}
                  </span>
                  <span 
                    className={`${textColor}/70 font-mono text-xs hidden sm:inline`}
                  >
                    L{entry.level}
                  </span>
                  <span 
                    className={`${textColor}/50 font-mono text-xs hidden md:inline`}
                  >
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {currentPlayerName && (
        <div className="mt-4 text-center">
          <p className="text-cyan-400 font-mono text-xs" style={{ letterSpacing: '0.05em' }}>
            Your scores are highlighted in cyan
          </p>
        </div>
      )}
    </div>
  );
}
