import { LeaderboardEntry } from '@/lib/types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_ENTRIES = 10;

export const leaderboardManager = {
  // Get all leaderboard entries
  getLeaderboard: (): LeaderboardEntry[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (!data) return [];

      const entries: LeaderboardEntry[] = JSON.parse(data);
      return entries.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
      return [];
    }
  },

  // Add a new entry to the leaderboard
  addEntry: (playerName: string, score: number, wave: number): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const entries = leaderboardManager.getLeaderboard();

      const newEntry: LeaderboardEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        playerName: playerName || 'Anonymous',
        score,
        wave,
        date: Date.now()
      };

      entries.push(newEntry);
      const sortedEntries = entries.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);

      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedEntries));

      // Check if the new entry made it to the top 10
      return sortedEntries.some(entry => entry.id === newEntry.id);
    } catch (error) {
      console.warn('Failed to add leaderboard entry:', error);
      return false;
    }
  },

  // Check if a score qualifies for the leaderboard
  isHighScore: (score: number): boolean => {
    if (typeof window === 'undefined') return false;

    const entries = leaderboardManager.getLeaderboard();
    if (entries.length < MAX_ENTRIES) return true;

    const lowestScore = entries[entries.length - 1]?.score || 0;
    return score > lowestScore;
  },

  // Clear the leaderboard
  clearLeaderboard: (): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch (error) {
      console.warn('Failed to clear leaderboard:', error);
    }
  }
};
