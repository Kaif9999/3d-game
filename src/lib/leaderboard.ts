import { ScoreEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';

export const getLeaderboard = (): ScoreEntry[] => {
  try {
    const leaderboardData = localStorage.getItem(LEADERBOARD_KEY);
    return leaderboardData ? JSON.parse(leaderboardData) : [];
  } catch (error) {
    console.error('Failed to get leaderboard from localStorage', error);
    return [];
  }
};

export const addToLeaderboard = (newScore: ScoreEntry): void => {
  try {
    const leaderboard = getLeaderboard();
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score);
    // Keep top 10 scores
    const updatedLeaderboard = leaderboard.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  } catch (error) {
    console.error('Failed to add to leaderboard in localStorage', error);
  }
};
