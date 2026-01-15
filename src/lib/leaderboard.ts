// Leaderboard utility functions and types

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  wave: number;
  timestamp: number;
}

const LEADERBOARD_STORAGE_KEY = 'spaceShooterLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

/**
 * Get all leaderboard entries from localStorage
 */
export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const entries: LeaderboardEntry[] = JSON.parse(stored);
    return entries.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.warn('Failed to load leaderboard from localStorage:', error);
    return [];
  }
}

/**
 * Add a new score to the leaderboard
 */
export function addToLeaderboard(playerName: string, score: number, wave: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const entries = getLeaderboard();

    // Add new entry
    entries.push({
      playerName,
      score,
      wave,
      timestamp: Date.now()
    });

    // Sort by score (descending) and keep only top entries
    const sorted = entries
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_LEADERBOARD_ENTRIES);

    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(sorted));
  } catch (error) {
    console.warn('Failed to save leaderboard to localStorage:', error);
  }
}

/**
 * Clear all leaderboard entries
 */
export function clearLeaderboard(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear leaderboard from localStorage:', error);
  }
}

/**
 * Check if a score would make it to the leaderboard
 */
export function isHighScore(score: number): boolean {
  const entries = getLeaderboard();

  if (entries.length < MAX_LEADERBOARD_ENTRIES) {
    return true;
  }

  return score > entries[entries.length - 1].score;
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
