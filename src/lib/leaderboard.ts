import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_ENTRIES = 50;

/**
 * Retrieves the leaderboard from localStorage
 */
export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    
    const entries: LeaderboardEntry[] = JSON.parse(data);
    return entries.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.warn('Failed to load leaderboard from localStorage:', error);
    return [];
  }
}

/**
 * Adds a new entry to the leaderboard
 */
export function addLeaderboardEntry(
  playerName: string,
  score: number,
  wave: number
): LeaderboardEntry {
  const entry: LeaderboardEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    playerName: playerName.trim() || 'Anonymous',
    score,
    wave,
    timestamp: Date.now(),
  };

  try {
    const leaderboard = getLeaderboard();
    leaderboard.push(entry);
    
    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top MAX_ENTRIES
    const trimmed = leaderboard.slice(0, MAX_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    
    return entry;
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
    return entry;
  }
}

/**
 * Gets the top N entries from the leaderboard
 */
export function getTopScores(limit: number = 10): LeaderboardEntry[] {
  const leaderboard = getLeaderboard();
  return leaderboard.slice(0, limit);
}

/**
 * Gets the rank of a specific entry (1-based)
 */
export function getEntryRank(entryId: string): number | null {
  const leaderboard = getLeaderboard();
  const index = leaderboard.findIndex(entry => entry.id === entryId);
  return index >= 0 ? index + 1 : null;
}

/**
 * Clears the entire leaderboard
 */
export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.warn('Failed to clear leaderboard:', error);
  }
}

/**
 * Formats a timestamp to a readable date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
