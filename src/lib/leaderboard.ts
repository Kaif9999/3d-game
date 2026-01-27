// Leaderboard management with sessionStorage

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
  level: number;
}

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_ENTRIES = 10;

export const getLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') return [];

  try {
    const data = sessionStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to load leaderboard:', error);
    return [];
  }
};

export const addLeaderboardEntry = (name: string, score: number, level: number): void => {
  if (typeof window === 'undefined') return;

  try {
    const leaderboard = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      name: name.trim() || 'Anonymous',
      score,
      timestamp: Date.now(),
      level
    };

    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top entries
    const trimmedLeaderboard = leaderboard.slice(0, MAX_ENTRIES);

    sessionStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmedLeaderboard));
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
  }
};

export const getPlayerHighScore = (playerName: string): number => {
  if (typeof window === 'undefined') return 0;

  const leaderboard = getLeaderboard();
  const playerEntries = leaderboard.filter(
    entry => entry.name.toLowerCase() === playerName.toLowerCase()
  );

  if (playerEntries.length === 0) return 0;

  return Math.max(...playerEntries.map(entry => entry.score));
};

export const clearLeaderboard = (): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.warn('Failed to clear leaderboard:', error);
  }
};
