import { LeaderboardEntry, LeaderboardData } from '@/lib/types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_ENTRIES = 10;

class LeaderboardManager {
  /**
   * Get all leaderboard entries
   */
  getLeaderboard(): LeaderboardEntry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (!data) return [];
      
      const leaderboardData: LeaderboardData = JSON.parse(data);
      return leaderboardData.entries || [];
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
      return [];
    }
  }

  /**
   * Add a new entry to the leaderboard
   */
  addEntry(playerName: string, score: number, wave: number): LeaderboardEntry {
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName: playerName.trim() || 'Anonymous',
      score,
      wave,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString()
    };

    const entries = this.getLeaderboard();
    entries.push(entry);
    
    // Sort by score (descending) and keep only top entries
    entries.sort((a, b) => b.score - a.score);
    const topEntries = entries.slice(0, MAX_ENTRIES);
    
    this.saveLeaderboard(topEntries);
    return entry;
  }

  /**
   * Check if a score qualifies for the leaderboard
   */
  isHighScore(score: number): boolean {
    const entries = this.getLeaderboard();
    
    // If leaderboard isn't full, any score qualifies
    if (entries.length < MAX_ENTRIES) return true;
    
    // Check if score is higher than the lowest entry
    const lowestScore = entries[entries.length - 1]?.score || 0;
    return score > lowestScore;
  }

  /**
   * Get the rank of a score (1-based)
   */
  getRank(score: number): number {
    const entries = this.getLeaderboard();
    const rank = entries.filter(entry => entry.score > score).length + 1;
    return rank;
  }

  /**
   * Clear all leaderboard entries
   */
  clearLeaderboard(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch (error) {
      console.warn('Failed to clear leaderboard:', error);
    }
  }

  /**
   * Save leaderboard to localStorage
   */
  private saveLeaderboard(entries: LeaderboardEntry[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      const data: LeaderboardData = { entries };
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save leaderboard:', error);
    }
  }

  /**
   * Get top N entries
   */
  getTopEntries(count: number = 5): LeaderboardEntry[] {
    const entries = this.getLeaderboard();
    return entries.slice(0, count);
  }
}

// Export singleton instance
const leaderboardManager = new LeaderboardManager();
export default leaderboardManager;
