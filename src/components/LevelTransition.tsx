'use client';
import { useEffect } from 'react';
import type { LevelConfig } from '@/lib/types';

interface LevelTransitionProps {
  levelConfig: LevelConfig;
  onComplete: () => void;
}

export default function LevelTransition({ levelConfig, onComplete }: LevelTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const isBoss = levelConfig.level === 10;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/90 backdrop-blur-sm">
      <div className="text-center px-4 animate-fade-in">
        {/* Level number */}
        <div 
          className={`${isBoss ? 'text-8xl' : 'text-7xl'} font-bold mb-4 ${isBoss ? 'text-red-500 animate-pulse' : 'text-green-400'}`}
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textShadow: isBoss ? '0 0 20px rgba(239, 68, 68, 0.8)' : '0 0 20px rgba(74, 222, 128, 0.5)'
          }}
        >
          {isBoss ? 'FINAL BOSS' : `LEVEL ${levelConfig.level}`}
        </div>

        {/* Level description */}
        <div 
          className={`text-3xl font-bold mb-6 ${isBoss ? 'text-red-400' : 'text-cyan-400'}`}
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          {levelConfig.description}
        </div>

        {/* Level theme */}
        <div 
          className="text-lg text-green-400/80 mb-8"
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.1em'
          }}
        >
          {levelConfig.theme}
        </div>

        {/* Enemy count indicator */}
        {!isBoss && (
          <div className="flex justify-center gap-4 text-green-400 font-mono text-sm">
            <div className="border-2 border-green-400 px-4 py-2">
              ENEMIES: {levelConfig.enemies}
            </div>
            <div className="border-2 border-green-400 px-4 py-2">
              TYPES: {levelConfig.types.length}
            </div>
          </div>
        )}

        {/* Boss warning */}
        {isBoss && (
          <div className="mt-8">
            <div 
              className="text-red-500 text-2xl font-bold animate-pulse"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.2em'
              }}
            >
              ⚠ WARNING ⚠
            </div>
            <div 
              className="text-red-400 text-lg mt-2"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.1em'
              }}
            >
              EXTREME THREAT DETECTED
            </div>
          </div>
        )}

        {/* Loading indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-green-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-green-400 animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-3 h-3 bg-green-400 animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
}
