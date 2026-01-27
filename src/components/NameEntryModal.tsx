'use client';
import { useState, useEffect } from 'react';

interface NameEntryModalProps {
  onNameSubmit: (name: string) => void;
  initialName?: string;
}

export default function NameEntryModal({ onNameSubmit, initialName = '' }: NameEntryModalProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  useEffect(() => {
    // Focus input on mount
    const input = document.getElementById('player-name-input');
    if (input) {
      input.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    
    onNameSubmit(trimmedName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm px-4">
      <div className="retro-box border-4 border-green-400 bg-black p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-6 text-center" style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          ENTER NAME
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="player-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="YOUR NAME"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-green-400 bg-black text-green-400 font-mono text-lg focus:outline-none focus:border-green-300 placeholder-green-400/50"
              style={{ letterSpacing: '0.1em' }}
              autoComplete="off"
            />
            {error && (
              <p className="mt-2 text-red-400 text-sm font-mono">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full retro-button px-6 py-3 border-4 border-green-400 bg-black text-green-400 font-bold text-xl hover:bg-green-400 hover:text-black transition-all"
            style={{
              fontFamily: 'monospace',
              letterSpacing: '0.15em'
            }}
          >
            START GAME
          </button>
        </form>
        
        <div className="mt-4 text-center text-green-400/70 text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
          Press ENTER to continue
        </div>
      </div>
    </div>
  );
}
