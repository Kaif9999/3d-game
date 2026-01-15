'use client';
import { useState, useEffect, useRef } from 'react';

interface PlayerNameModalProps {
  score: number;
  wave: number;
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

export default function PlayerNameModal({ score, wave, onSubmit, onSkip }: PlayerNameModalProps) {
  const [playerName, setPlayerName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = playerName.trim();
    if (name) {
      onSubmit(name);
    } else {
      onSubmit('Anonymous');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSkip();
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/80">
      <div className="retro-box border-4 border-yellow-400 bg-black p-8 max-w-md w-full mx-4">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em'
        }}>
          HIGH SCORE!
        </h2>

        <div className="border-4 border-yellow-400/50 bg-black p-4 mb-6">
          <div className="text-green-400 text-center mb-2" style={{ fontFamily: 'monospace' }}>
            YOUR SCORE
          </div>
          <div className="text-4xl font-bold text-green-400 text-center mb-2" style={{ fontFamily: 'monospace' }}>
            {score.toString().padStart(6, '0')}
          </div>
          <div className="text-cyan-400 text-center text-sm" style={{ fontFamily: 'monospace' }}>
            WAVE {wave}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label 
              htmlFor="playerName" 
              className="block text-yellow-400 text-sm mb-2 text-center" 
              style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}
            >
              ENTER YOUR NAME
            </label>
            <input
              ref={inputRef}
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
              onKeyDown={handleKeyDown}
              placeholder="PLAYER"
              maxLength={20}
              className="w-full px-4 py-3 border-4 border-yellow-400 bg-black text-yellow-400 font-mono text-xl text-center uppercase focus:outline-none focus:border-green-400 transition-colors"
              style={{ letterSpacing: '0.1em' }}
            />
            <div className="text-yellow-400/50 text-xs text-center mt-1" style={{ fontFamily: 'monospace' }}>
              {playerName.length}/20 CHARACTERS
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full retro-button px-6 py-3 border-4 border-green-400 bg-black text-green-400 font-bold text-lg hover:bg-green-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.15em'
              }}
            >
              SAVE SCORE
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="w-full retro-button px-6 py-3 border-4 border-gray-400 bg-black text-gray-400 font-bold text-sm hover:bg-gray-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.15em'
              }}
            >
              SKIP
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-yellow-400/50 text-xs" style={{ fontFamily: 'monospace' }}>
            Press ESC to skip
          </p>
        </div>
      </div>
    </div>
  );
}
