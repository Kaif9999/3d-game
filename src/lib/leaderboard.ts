// Leaderboard utilities for managing high scores with sessionStorage

export interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  timestamp: number;
}

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = sessionStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to load leaderboard:', error);
    return [];
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  try {
    const leaderboard = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      timestamp: Date.now()
    };

    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top entries
    const topEntries = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);

    sessionStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
  }
}

export function getPlayerHighScore(playerName: string): number {
  const leaderboard = getLeaderboard();
  const playerEntries = leaderboard.filter(entry => entry.name === playerName);

  if (playerEntries.length === 0) return 0;

  return Math.max(...playerEntries.map(entry => entry.score));
}

export function clearLeaderboard(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.warn('Failed to clear leaderboard:', error);
  }
}
