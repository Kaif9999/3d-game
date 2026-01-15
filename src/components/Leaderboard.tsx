'use client';
import { ScoreEntry } from '@/lib/types';

interface LeaderboardProps {
  scores: ScoreEntry[];
  onClose: () => void;
  isDialog?: boolean;
}

export default function Leaderboard({ scores, onClose, isDialog = false }: LeaderboardProps) {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 10);

  const content = (
    <div className="retro-box border-4 border-green-400 bg-black p-8 max-w-lg w-full">
      <h2 className="text-5xl font-bold text-green-400 mb-8 text-center retro-title" style={{
        fontFamily: 'monospace',
        letterSpacing: '0.2em',
        textTransform: 'uppercase'
      }}>
        Leaderboard
      </h2>
      <ol className="space-y-2 text-green-400 font-mono">
        {sortedScores.map((entry, index) => (
          <li key={index} className="flex justify-between items-center text-lg p-2 border-b-2 border-green-400/30">
            <span className="font-bold">{index + 1}. {entry.name}</span>
            <span>{entry.score.toString().padStart(6, '0')}</span>
          </li>
        ))}
        {sortedScores.length === 0 && (
          <p className="text-center">No scores yet. Be the first!</p>
        )}
      </ol>
      {isDialog && (
        <button
          onClick={onClose}
          className="w-full retro-button mt-8 px-8 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.15em'
          }}
        >
          BACK
        </button>
      )}
    </div>
  );

  if (isDialog) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/80">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center p-4">
       {content}
       <button
        onClick={onClose}
        className="mt-8 retro-button px-12 py-4 border-4 border-green-400 bg-black text-green-400 font-bold text-2xl hover:bg-green-400 hover:text-black transition-all"
        style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em'
        }}
        aria-label="Back to menu"
      >
        BACK TO MENU
      </button>
    </div>
  );
}
