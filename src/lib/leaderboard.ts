import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

/**
 * Get all leaderboard entries from localStorage
 */
export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) {
      return [];
    }
    const entries = JSON.parse(data) as LeaderboardEntry[];
    return entries.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.warn('Failed to load leaderboard from localStorage:', error);
    return [];
  }
}

/**
 * Add a new entry to the leaderboard
 */
export function addLeaderboardEntry(
  playerName: string,
  score: number,
  wave: number
): { rank: number; isTopTen: boolean } {
  if (typeof window === 'undefined') {
    return { rank: -1, isTopTen: false };
  }

  try {
    const entries = getLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName: playerName.trim() || 'Anonymous',
      score,
      wave,
      date: new Date().toISOString(),
    };

    entries.push(newEntry);
    entries.sort((a, b) => b.score - a.score);

    // Keep only top entries
    const topEntries = entries.slice(0, MAX_LEADERBOARD_ENTRIES);
    
    // Find rank (1-indexed)
    const rank = entries.findIndex(e => e.id === newEntry.id) + 1;
    const isTopTen = rank <= MAX_LEADERBOARD_ENTRIES;

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));

    return { rank, isTopTen };
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
    return { rank: -1, isTopTen: false };
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
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.warn('Failed to clear leaderboard:', error);
  }
}

/**
 * Check if a score would make it to the leaderboard
 */
export function wouldMakeLeaderboard(score: number): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const entries = getLeaderboard();
  
  // If less than max entries, always makes it
  if (entries.length < MAX_LEADERBOARD_ENTRIES) {
    return true;
  }

  // Check if score is higher than the lowest entry
  const lowestScore = entries[entries.length - 1]?.score || 0;
  return score > lowestScore;
}
