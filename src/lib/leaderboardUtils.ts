import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

/**
 * Get all leaderboard entries from localStorage
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
 * Add a new entry to the leaderboard
 */
export function addLeaderboardEntry(entry: LeaderboardEntry): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const leaderboard = getLeaderboard();
    leaderboard.push(entry);
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top entries
    const topEntries = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
    
    // Return true if the entry made it to the leaderboard
    return topEntries.some(e => 
      e.playerName === entry.playerName && 
      e.score === entry.score && 
      e.date === entry.date
    );
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
    return false;
  }
}

/**
 * Check if a score qualifies for the leaderboard
 */
export function isLeaderboardScore(score: number): boolean {
  const leaderboard = getLeaderboard();
  
  if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) {
    return true;
  }
  
  const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
  return score > lowestScore;
}

/**
 * Get the rank of a score in the leaderboard (1-based)
 */
export function getScoreRank(score: number): number | null {
  const leaderboard = getLeaderboard();
  const rank = leaderboard.findIndex(entry => entry.score <= score);
  
  if (rank === -1) {
    // Score is lower than all entries
    if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) {
      return leaderboard.length + 1;
    }
    return null;
  }
  
  return rank + 1;
}

/**
 * Clear all leaderboard entries
 */
export function clearLeaderboard(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.warn('Failed to clear leaderboard:', error);
  }
}
