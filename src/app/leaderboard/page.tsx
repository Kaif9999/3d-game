// @/app/leaderboard/page.tsx
import React from 'react';
import Leaderboard from '@/components/Leaderboard';
import Link from 'next/link';

const LeaderboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <Leaderboard />
      <Link href="/" className="mt-4 text-white hover:text-yellow-400">
        Back to Game
      </Link>
    </div>
  );
};

export default LeaderboardPage;
