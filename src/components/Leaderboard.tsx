// src/components/Leaderboard.tsx
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  onClose: () => void;
}

export default function Leaderboard({ scores, onClose }: LeaderboardProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 bg-black/80">
      <div className="retro-box border-4 border-green-400 bg-black p-8 max-w-lg w-full">
        <h2 className="text-5xl font-bold text-green-400 mb-8 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          Leaderboard
        </h2>
        <div className="text-green-400 space-y-2" style={{ fontFamily: 'monospace' }}>
          <div className="flex justify-between items-center border-b-2 border-green-400/50 pb-2 text-lg">
            <span className="font-bold w-1/4">Rank</span>
            <span className="font-bold w-1/2">Name</span>
            <span className="font-bold w-1/4 text-right">Score</span>
          </div>
          {scores.length > 0 ? (
            scores.map((entry, index) => (
              <div key={entry.id} className="flex justify-between items-center border-b border-green-400/30 py-2">
                <span className="w-1/4">{index + 1}</span>
                <span className="w-1/2 truncate">{entry.name}</span>
                <span className="w-1/4 text-right">{entry.score}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">No scores yet. Be the first!</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-8 retro-button px-8 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.15em'
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
