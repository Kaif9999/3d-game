// src/lib/leaderboard.ts
import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';

export const getLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const leaderboardJson = localStorage.getItem(LEADERBOARD_KEY);
    return leaderboardJson ? JSON.parse(leaderboardJson) : [];
  } catch (error) {
    console.warn('Failed to load leaderboard from localStorage:', error);
    return [];
  }
};

export const saveScore = (name: string, score: number) => {
  if (typeof window === 'undefined') {
    return;
  }
  const leaderboard = getLeaderboard();
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  // Keep top 10 scores
  const newLeaderboard = leaderboard.slice(0, 10);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(newLeaderboard));
  } catch (error) {
    console.warn('Failed to save leaderboard to localStorage:', error);
  }
};
