import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface LeaderboardEntry {
  name: string;
  score: number;
  createdAt: string;
}

const LEADERBOARD_DIR = path.join(process.cwd(), 'data');
const LEADERBOARD_PATH = path.join(LEADERBOARD_DIR, 'leaderboard.json');
const LEADERBOARD_LIMIT = 20;

const isValidName = (name: unknown): name is string => {
  return typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= 20;
};

const isValidScore = (score: unknown): score is number => {
  return typeof score === 'number' && Number.isFinite(score) && score >= 0;
};

export async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const raw = await fs.readFile(LEADERBOARD_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => isValidName(entry?.name) && isValidScore(entry?.score) && typeof entry?.createdAt === 'string')
      .map((entry) => ({
        name: entry.name.trim(),
        score: Math.floor(entry.score),
        createdAt: entry.createdAt,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD_LIMIT);
  } catch {
    return [];
  }
}

async function writeLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
  await fs.mkdir(LEADERBOARD_DIR, { recursive: true });
  const normalized = entries
    .map((entry) => ({
      name: entry.name.trim(),
      score: Math.floor(entry.score),
      createdAt: entry.createdAt,
    }))
    .filter((entry) => isValidName(entry.name) && isValidScore(entry.score) && typeof entry.createdAt === 'string')
    .sort((a, b) => b.score - a.score)
    .slice(0, LEADERBOARD_LIMIT);

  await fs.writeFile(LEADERBOARD_PATH, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
}

export async function addLeaderboardEntry(input: { name: unknown; score: unknown }): Promise<LeaderboardEntry[]> {
  if (!isValidName(input.name)) {
    throw new Error('Invalid name');
  }
  if (!isValidScore(input.score)) {
    throw new Error('Invalid score');
  }

  const current = await readLeaderboard();
  const next: LeaderboardEntry[] = [
    {
      name: input.name.trim(),
      score: Math.floor(input.score),
      createdAt: new Date().toISOString(),
    },
    ...current,
  ];

  await writeLeaderboard(next);
  return await readLeaderboard();
}

