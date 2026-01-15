'use client';
import { useState, useEffect } from 'react';
import Leaderboard from '@/components/Leaderboard';
import { ScoreEntry } from '@/lib/types';
import * as CONSTANTS from '@/lib/gameConstants';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLeaderboard = localStorage.getItem(CONSTANTS.LEADERBOARD_STORAGE_KEY);
        if (savedLeaderboard) {
          setLeaderboard(JSON.parse(savedLeaderboard));
        }
      } catch (error) {
        console.warn('Failed to load leaderboard from localStorage:', error);
      }
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Leaderboard scores={leaderboard} onClose={() => router.push('/')} />
    </main>
  );
}
