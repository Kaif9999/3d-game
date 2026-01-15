'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/leaderboardUtils';
import type { LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 bg-black">
      <div className="retro-box border-4 border-green-400 bg-black p-8 max-w-lg w-full">
        <h2 className="text-5xl font-bold text-green-400 mb-8 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          Leaderboard
        </h2>
        
        <div className="space-y-2 text-green-400" style={{ fontFamily: 'monospace' }}>
          <div className="flex justify-between border-b-2 border-green-400 pb-2 text-lg">
            <span className="w-1/3">Player</span>
            <span className="w-1/3 text-center">Score</span>
            <span className="w-1/3 text-right">Date</span>
          </div>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="w-1/3 truncate">{entry.name}</span>
                <span className="w-1/3 text-center">{entry.score.toString().padStart(6, '0')}</span>
                <span className="w-1/3 text-right text-sm">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <div className="text-center pt-4">No scores yet. Be the first!</div>
          )}
        </div>

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
      </div>
    </div>
  );
}
