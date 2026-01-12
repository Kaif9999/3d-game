import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'spaceShooterLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    return JSON.parse(data);
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
    
    // Sort by score (descending) and keep top entries
    leaderboard.sort((a, b) => b.score - a.score);
    const topEntries = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
  } catch (error) {
    console.warn('Failed to save leaderboard entry:', error);
  }
}

export function getPlayerHighScore(playerName: string): number {
  const leaderboard = getLeaderboard();
  const playerEntries = leaderboard.filter(entry => entry.name === playerName);
  
  if (playerEntries.length === 0) return 0;
  
  return Math.max(...playerEntries.map(entry => entry.score));
}

export function getCurrentPlayerName(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return sessionStorage.getItem('playerName');
  } catch (error) {
    console.warn('Failed to get player name:', error);
    return null;
  }
}

export function setCurrentPlayerName(name: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem('playerName', name);
  } catch (error) {
    console.warn('Failed to set player name:', error);
  }
}
