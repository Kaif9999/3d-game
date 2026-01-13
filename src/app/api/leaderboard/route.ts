import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type ScoreEntry = {
  name: string;
  score: number;
  timestamp: number;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'leaderboard.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE).catch(async () => {
      await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf8');
    });
  } catch (e) {
    // noop
  }
}

async function readScores(): Promise<ScoreEntry[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8').catch(() => '[]');
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as ScoreEntry[];
    return [];
  } catch {
    return [];
  }
}

async function writeScores(scores: ScoreEntry[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(scores, null, 2), 'utf8');
}

export async function GET() {
  const scores = await readScores();
  const top = scores
    .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
    .slice(0, 20);
  return NextResponse.json(top, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let name: string = (body?.name ?? '').toString().trim();
    const score: number = Number(body?.score ?? 0);

    if (!name) name = 'Player';
    if (!Number.isFinite(score) || score < 0) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    // Sanitize name
    name = name.replace(/[\n\r\t]/g, ' ').slice(0, 24);

    const scores = await readScores();
    scores.push({ name, score: Math.floor(score), timestamp: Date.now() });

    // Keep only top 100 to bound file size
    const trimmed = scores
      .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
      .slice(0, 100);

    await writeScores(trimmed);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

