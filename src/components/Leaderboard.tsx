import React from 'react';

interface LeaderboardProps {
  leaderboard: { name: string; score: number }[];
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, onClose }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70">
      <div className="retro-box border-4 border-cyan-400 bg-black p-8 min-w-[400px]">
        <h2 className="text-5xl font-bold text-cyan-400 mb-8 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          Leaderboard
        </h2>
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div key={index} className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
              <span className="text-cyan-400 font-bold">{index + 1}. {entry.name}</span>
              <span className="text-green-400">{entry.score}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full retro-button px-8 py-4 border-4 border-cyan-400 bg-black text-cyan-400 font-bold text-xl hover:bg-cyan-400 hover:text-black transition-all"
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.15em'
          }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
