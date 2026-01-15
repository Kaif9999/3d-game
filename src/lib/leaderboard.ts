// src/lib/leaderboard.ts
import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const leaderboardData = localStorage.getItem(LEADERBOARD_KEY);
    if (leaderboardData) {
      return JSON.parse(leaderboardData);
    }
  } catch (error) {
    console.error('Failed to get leaderboard from localStorage', error);
  }
  return [];
};

export const addScoreToLeaderboard = (entry: Omit<LeaderboardEntry, 'id'>) => {
  try {
    const leaderboard = getLeaderboard();
    const newEntry: LeaderboardEntry = { ...entry, id: Date.now() };
    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);
    // Keep top 10
    const updatedLeaderboard = leaderboard.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  } catch (error) {
    console.error('Failed to add score to leaderboard in localStorage', error);
  }
};
