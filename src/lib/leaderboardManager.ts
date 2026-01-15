// Leaderboard management utility for Space Shooter Game

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  wave: number;
  date: string;
  id: string;
}

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_ENTRIES = 10;

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
export function addLeaderboardEntry(
  playerName: string,
  score: number,
  wave: number
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const entries = getLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      playerName: playerName.trim() || 'Anonymous',
      score,
      wave,
      date: new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    entries.push(newEntry);
    
    // Sort by score descending and keep only top MAX_ENTRIES
    const sortedEntries = entries
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedEntries));
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
  }
}

/**
 * Get top N entries from leaderboard
 */
export function getTopScores(count: number = 3): LeaderboardEntry[] {
  return getLeaderboard().slice(0, count);
}

/**
 * Check if a score qualifies for the leaderboard
 */
export function isHighScore(score: number): boolean {
  const entries = getLeaderboard();
  
  // If leaderboard isn't full, any score qualifies
  if (entries.length < MAX_ENTRIES) return true;
  
  // Check if score is higher than the lowest entry
  const lowestScore = entries[entries.length - 1]?.score || 0;
  return score > lowestScore;
}

/**
 * Clear all leaderboard entries (for testing/reset)
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
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
}
