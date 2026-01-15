// @/components/Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import { Score } from '@/lib/types';

const Leaderboard = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const savedScores = localStorage.getItem('scores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  return (
    <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-center text-white">Leaderboard</h2>
      <ul className="space-y-2">
        {scores.sort((a, b) => b.score - a.score).map((score, index) => (
          <li key={index} className="flex justify-between p-2 bg-gray-700 rounded-lg">
            <span className="text-white">{score.name}</span>
            <span className="text-yellow-400">{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
