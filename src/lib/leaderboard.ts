// Leaderboard management utilities

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
    console.warn('Failed to load leaderboard:', error);
    return [];
  }
}

/**
 * Add a new entry to the leaderboard
 */
export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'date'>): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const leaderboard = getLeaderboard();
    
    // Add new entry with current date
    const newEntry: LeaderboardEntry = {
      ...entry,
      date: new Date().toISOString()
    };
    
    leaderboard.push(newEntry);
    
    // Sort by score (descending) and keep top entries
    leaderboard.sort((a, b) => b.score - a.score);
    const topEntries = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
    
    // Save to localStorage
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
    
    // Return true if the new entry made it to the leaderboard
    return topEntries.some(e => e.name === entry.name && e.score === entry.score);
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
  
  // If leaderboard isn't full, any score qualifies
  if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) {
    return score > 0;
  }
  
  // Check if score is higher than the lowest entry
  const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
  return score > lowestScore;
}

/**
 * Clear the leaderboard (for testing/reset purposes)
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
 * Get player's rank for a given score
 */
export function getScoreRank(score: number): number {
  const leaderboard = getLeaderboard();
  
  let rank = 1;
  for (const entry of leaderboard) {
    if (score > entry.score) {
      return rank;
    }
    rank++;
  }
  
  return rank;
}
