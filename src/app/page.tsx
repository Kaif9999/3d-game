import type { Metadata } from 'next';
import SpaceShooterGame from '@/components/SpaceShooterGame';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Space Shooter Game',
  description: 'A classic 2D space shooter game built with Next.js 16 and Tailwind CSS',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <SpaceShooterGame />
      <div className="absolute top-4 right-4 z-20">
        <Link href="/leaderboard" className="retro-button px-4 py-2 border-2 border-green-400 bg-black text-green-400 font-mono text-lg hover:bg-green-400 hover:text-black transition-all">
          LEADERBOARD
        </Link>
      </div>
    </main>
  );
}
