import type { LeaderboardEntry } from '@/lib/types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';

export const getLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    const leaderboard = JSON.parse(data) as LeaderboardEntry[];
    return leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch (error) {
    console.warn('Failed to load leaderboard from localStorage:', error);
    return [];
  }
};

export const addToLeaderboard = (entry: Omit<LeaderboardEntry, 'date'>): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const newEntry: LeaderboardEntry = {
    ...entry,
    date: new Date().toISOString(),
  };
  const leaderboard = getLeaderboard();
  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => b.score - a.score);
  const updatedLeaderboard = leaderboard.slice(0, 10);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  } catch (error) {
    console.warn('Failed to save leaderboard to localStorage:', error);
  }
};
