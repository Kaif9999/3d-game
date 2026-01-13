// Leaderboard management utility
import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_ENTRIES = 10;

export class LeaderboardManager {
  // Get all leaderboard entries
  static getLeaderboard(): LeaderboardEntry[] {
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

  // Add a new entry to the leaderboard
  static addEntry(name: string, score: number, level: number): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const entries = this.getLeaderboard();
      
      const newEntry: LeaderboardEntry = {
        name: name.trim().substring(0, 20), // Limit name length
        score,
        level,
        date: new Date().toISOString()
      };
      
      entries.push(newEntry);
      
      // Sort by score (descending) and keep only top entries
      const sortedEntries = entries
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES);
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedEntries));
      
      // Return true if the new entry made it to the leaderboard
      return sortedEntries.some(e => 
        e.name === newEntry.name && 
        e.score === newEntry.score && 
        e.date === newEntry.date
      );
    } catch (error) {
      console.warn('Failed to save leaderboard entry:', error);
      return false;
    }
  }

  // Check if a score qualifies for the leaderboard
  static qualifiesForLeaderboard(score: number): boolean {
    if (typeof window === 'undefined') return false;
    
    const entries = this.getLeaderboard();
    
    // If less than max entries, always qualifies
    if (entries.length < MAX_ENTRIES) return true;
    
    // Check if score is higher than the lowest entry
    const lowestScore = entries[entries.length - 1]?.score || 0;
    return score > lowestScore;
  }

  // Clear all leaderboard entries
  static clearLeaderboard(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch (error) {
      console.warn('Failed to clear leaderboard:', error);
    }
  }

  // Get player's rank for a given score
  static getRank(score: number): number {
    const entries = this.getLeaderboard();
    const rank = entries.filter(e => e.score > score).length + 1;
    return rank;
  }
}

export default LeaderboardManager;
