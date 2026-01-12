import { LeaderboardEntry } from './types';

const LEADERBOARD_STORAGE_KEY = 'spaceShooterLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!data) return [];
    
    const entries: LeaderboardEntry[] = JSON.parse(data);
    return entries.sort((a, b) => b.score - a.score).slice(0, MAX_LEADERBOARD_ENTRIES);
  } catch (error) {
    console.warn('Failed to load leaderboard:', error);
    return [];
  }
}

export function addLeaderboardEntry(entry: LeaderboardEntry): void {
  if (typeof window === 'undefined') return;
  
  try {
    const leaderboard = getLeaderboard();
    leaderboard.push(entry);
    
    // Sort by score (descending) and keep top 10
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_LEADERBOARD_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(sortedLeaderboard));
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
  }
}

export function isTopScore(score: number): boolean {
  const leaderboard = getLeaderboard();
  
  if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) {
    return true;
  }
  
  const lowestTopScore = leaderboard[leaderboard.length - 1].score;
  return score > lowestTopScore;
}

export function getPlayerHighScore(playerName: string): number {
  const leaderboard = getLeaderboard();
  const playerEntries = leaderboard.filter(entry => entry.name === playerName);
  
  if (playerEntries.length === 0) return 0;
  
  return Math.max(...playerEntries.map(entry => entry.score));
}
