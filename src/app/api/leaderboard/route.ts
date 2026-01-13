import { NextResponse } from 'next/server';

import { addLeaderboardEntry, readLeaderboard } from '@/lib/leaderboardStore';

export const runtime = 'nodejs';

export async function GET() {
  const entries = await readLeaderboard();
  return NextResponse.json({ entries }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entries = await addLeaderboardEntry({ name: body?.name, score: body?.score });
    return NextResponse.json({ entries }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
}

