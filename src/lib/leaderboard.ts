// Leaderboard management with localStorage persistence

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  wave: number;
  timestamp: number;
}

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_ENTRIES = 10;

export class LeaderboardManager {
  static getLeaderboard(): LeaderboardEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (!data) return [];

      const entries: LeaderboardEntry[] = JSON.parse(data);
      return entries.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
      return [];
    }
  }

  static addEntry(entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    try {
      const entries = this.getLeaderboard();
      const newEntry: LeaderboardEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      };

      entries.push(newEntry);
      entries.sort((a, b) => b.score - a.score);

      const topEntries = entries.slice(0, MAX_ENTRIES);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
    } catch (error) {
      console.warn('Failed to save leaderboard entry:', error);
    }
  }

  static isTopScore(score: number): boolean {
    const entries = this.getLeaderboard();
    if (entries.length < MAX_ENTRIES) return true;
    return score > entries[entries.length - 1].score;
  }

  static clearLeaderboard(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch (error) {
      console.warn('Failed to clear leaderboard:', error);
    }
  }

  static getPlayerRank(score: number): number {
    const entries = this.getLeaderboard();
    let rank = 1;

    for (const entry of entries) {
      if (score > entry.score) break;
      rank++;
    }

    return rank;
  }
}
