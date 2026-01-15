// Leaderboard management utilities

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  wave: number;
  timestamp: number;
}

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

/**
 * Get all leaderboard entries sorted by score (descending)
 */
export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];

    const entries: LeaderboardEntry[] = JSON.parse(data);
    return entries.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.warn('Failed to load leaderboard:', error);
    return [];
  }
}

/**
 * Add a new entry to the leaderboard
 */
export function addLeaderboardEntry(playerName: string, score: number, wave: number): void {
  if (typeof window === 'undefined') return;

  try {
    const entries = getLeaderboard();

    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName: playerName.trim() || 'Anonymous',
      score,
      wave,
      timestamp: Date.now()
    };

    entries.push(newEntry);

    // Sort by score descending and keep only top entries
    const sortedEntries = entries
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_LEADERBOARD_ENTRIES);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedEntries));
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
  }
}

/**
 * Check if a score qualifies for the leaderboard
 */
export function isHighScore(score: number): boolean {
  const entries = getLeaderboard();

  // Always qualifies if leaderboard isn't full
  if (entries.length < MAX_LEADERBOARD_ENTRIES) return true;

  // Check if score beats the lowest entry
  const lowestScore = entries[entries.length - 1]?.score ?? 0;
  return score > lowestScore;
}

/**
 * Clear the entire leaderboard
 */
export function clearLeaderboard(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.warn('Failed to clear leaderboard:', error);
  }
}

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
