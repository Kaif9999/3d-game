import { LeaderboardEntry } from './types';
import * as CONSTANTS from './gameConstants';

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(CONSTANTS.LEADERBOARD_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to load leaderboard:', error);
    return [];
  }
}

export function saveToLeaderboard(name: string, score: number, level: number): void {
  if (typeof window === 'undefined') return;

  try {
    const leaderboard = getLeaderboard();
    const entry: LeaderboardEntry = {
      name: name.trim() || 'Anonymous',
      score,
      level,
      date: new Date().toISOString(),
    };

    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);

    const topEntries = leaderboard.slice(0, CONSTANTS.MAX_LEADERBOARD_ENTRIES);
    localStorage.setItem(CONSTANTS.LEADERBOARD_STORAGE_KEY, JSON.stringify(topEntries));
  } catch (error) {
    console.warn('Failed to save to leaderboard:', error);
  }
}

export function isHighScore(score: number): boolean {
  const leaderboard = getLeaderboard();
  if (leaderboard.length < CONSTANTS.MAX_LEADERBOARD_ENTRIES) return true;
  return score > leaderboard[leaderboard.length - 1].score;
}
