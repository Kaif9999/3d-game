'use client';
import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import LeaderboardManager from '@/lib/leaderboardManager';

interface LeaderboardProps {
  currentScore?: number;
  currentLevel?: number;
  highlightScore?: boolean;
}

export default function Leaderboard({ currentScore, currentLevel, highlightScore }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadLeaderboard = () => {
      const leaderboardData = LeaderboardManager.getLeaderboard();
      setEntries(leaderboardData);
    };

    loadLeaderboard();
  }, [currentScore, currentLevel]);

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

  const isCurrentScore = (entry: LeaderboardEntry) => {
    return highlightScore && 
           entry.score === currentScore && 
           entry.level === currentLevel;
  };

  return (
    <div className="retro-box border-4 border-yellow-400 bg-black p-6 max-w-2xl w-full mx-4">
      <h2 
        className="text-4xl font-bold text-yellow-400 mb-6 text-center"
        style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}
      >
        LEADERBOARD
      </h2>
      
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-yellow-400/60 font-mono text-lg">
            NO SCORES YET
          </p>
          <p className="text-yellow-400/40 font-mono text-sm mt-2">
            BE THE FIRST TO SET A RECORD!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 pb-2 border-b-2 border-yellow-400/50 text-yellow-400 font-mono text-sm">
            <div className="col-span-1 text-center">RANK</div>
            <div className="col-span-5">NAME</div>
            <div className="col-span-2 text-right">SCORE</div>
            <div className="col-span-2 text-center">LEVEL</div>
            <div className="col-span-2 text-right">DATE</div>
          </div>
          
          {/* Entries */}
          {entries.map((entry, index) => {
            const isHighlight = isCurrentScore(entry);
            const rankColor = index === 0 ? 'text-yellow-300' : 
                            index === 1 ? 'text-gray-300' : 
                            index === 2 ? 'text-orange-400' : 
                            'text-yellow-400';
            
            return (
              <div
                key={`${entry.name}-${entry.score}-${entry.date}`}
                className={`grid grid-cols-12 gap-2 py-2 font-mono text-sm transition-all ${
                  isHighlight 
                    ? 'bg-yellow-400/20 border-2 border-yellow-400 px-2 animate-pulse' 
                    : 'border-b border-yellow-400/20'
                }`}
              >
                <div className={`col-span-1 text-center font-bold ${rankColor}`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className={`col-span-5 truncate ${isHighlight ? 'text-yellow-300 font-bold' : 'text-yellow-400'}`}>
                  {entry.name}
                </div>
                <div className={`col-span-2 text-right ${isHighlight ? 'text-yellow-300 font-bold' : 'text-green-400'}`}>
                  {entry.score.toLocaleString()}
                </div>
                <div className={`col-span-2 text-center ${isHighlight ? 'text-yellow-300 font-bold' : 'text-cyan-400'}`}>
                  {entry.level}
                </div>
                <div className={`col-span-2 text-right text-xs ${isHighlight ? 'text-yellow-300' : 'text-yellow-400/60'}`}>
                  {formatDate(entry.date)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {entries.length > 0 && (
        <div className="mt-6 pt-4 border-t-2 border-yellow-400/30 text-center">
          <p className="text-yellow-400/60 font-mono text-xs">
            TOP {entries.length} PLAYERS
          </p>
        </div>
      )}
    </div>
  );
}
