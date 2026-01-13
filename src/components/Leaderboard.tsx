'use client';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/leaderboard';
import type { LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  highlightScore?: number;
  compact?: boolean;
}

export default function Leaderboard({ highlightScore, compact = false }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);

  if (entries.length === 0) {
    return (
      <div className="retro-box border-4 border-green-400 bg-black p-6">
        <h3 
          className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-green-400 mb-4 text-center`}
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

  return (
    <div className="retro-box border-4 border-green-400 bg-black p-6">
      <h3 
        className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-green-400 mb-4 text-center`}
        style={{
          fontFamily: 'monospace',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}
      >
        LEADERBOARD
      </h3>
      
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 pb-2 border-b-2 border-green-400/50 text-green-400 font-mono text-xs">
          <div className="col-span-2 text-center">RANK</div>
          <div className="col-span-5">NAME</div>
          <div className="col-span-3 text-right">SCORE</div>
          <div className="col-span-2 text-center">LVL</div>
        </div>
        
        {/* Entries */}
        {entries.map((entry, index) => {
          const isHighlighted = highlightScore !== undefined && entry.score === highlightScore;
          const rankColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-green-400';
          
          return (
            <div
              key={`${entry.name}-${entry.score}-${index}`}
              className={`grid grid-cols-12 gap-2 py-2 font-mono text-sm transition-all ${
                isHighlighted 
                  ? 'bg-green-400/20 border-2 border-green-400 animate-pulse' 
                  : 'border-b border-green-400/20'
              }`}
            >
              <div className={`col-span-2 text-center font-bold ${rankColor}`}>
                {index === 0 && '👑 '}
                #{index + 1}
              </div>
              <div className={`col-span-5 truncate ${isHighlighted ? 'text-green-300 font-bold' : 'text-green-400'}`}>
                {entry.name}
              </div>
              <div className={`col-span-3 text-right ${isHighlighted ? 'text-green-300 font-bold' : 'text-green-400'}`}>
                {entry.score.toLocaleString()}
              </div>
              <div className={`col-span-2 text-center ${isHighlighted ? 'text-green-300' : 'text-green-400/70'}`}>
                {entry.level}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer info */}
      {!compact && (
        <div className="mt-4 pt-4 border-t-2 border-green-400/30 text-center">
          <p className="text-green-400/70 text-xs font-mono">
            TOP {entries.length} PLAYERS
          </p>
        </div>
      )}
    </div>
  );
}
