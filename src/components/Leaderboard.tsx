import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/leaderboard';
import { ScoreEntry } from '../lib/types';

interface LeaderboardProps {
  currentScore?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(getLeaderboard());
  }, [currentScore]);

  return (
    <div className="bg-black bg-opacity-75 text-white p-4 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Leaderboard</h2>
      {currentScore !== undefined && (
        <p className="text-center text-lg mb-4">Your Score: {currentScore}</p>
      )}
      <ol className="list-decimal list-inside">
        {scores.map((score, index) => (
          <li key={index} className="flex justify-between items-center p-2 border-b border-gray-600">
            <span className="font-bold">{index + 1}. {score.name}</span>
            <span className="text-yellow-400">{score.score}</span>
            <span className="text-xs text-gray-400">{new Date(score.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ol>
      {scores.length === 0 && <p className="text-center mt-4">No scores yet. Be the first!</p>}
    </div>
  );
};

export default Leaderboard;
