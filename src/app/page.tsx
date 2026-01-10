import type { Metadata } from 'next';
import SpaceShooterGame from '@/components/SpaceShooterGame';

export const metadata: Metadata = {
  title: 'Space Shooter Game',
  description: 'A classic 2D space shooter game built with Next.js 16 and Tailwind CSS',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <SpaceShooterGame />
    </main>
  );
}

