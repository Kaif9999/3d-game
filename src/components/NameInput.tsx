'use client';
import { useState, useEffect, useRef } from 'react';

interface NameInputProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export default function NameInput({ onSubmit, onCancel }: NameInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
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
    
    onSubmit(trimmedName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/80 backdrop-blur-sm">
      <div className="retro-box border-4 border-cyan-400 bg-black p-8 max-w-md w-full mx-4">
        <h2 
          className="text-4xl font-bold text-cyan-400 mb-6 text-center"
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}
        >
          ENTER NAME
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="playerName" 
              className="block text-cyan-400 mb-2 text-sm"
              style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}
            >
              PLAYER NAME:
            </label>
            <input
              ref={inputRef}
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              maxLength={20}
              className="w-full px-4 py-3 bg-black border-2 border-cyan-400 text-cyan-400 font-mono text-lg focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              placeholder="ENTER YOUR NAME"
              style={{ letterSpacing: '0.1em' }}
              autoComplete="off"
            />
            {error && (
              <p className="mt-2 text-red-400 text-sm font-mono">
                {error}
              </p>
            )}
            <p className="mt-2 text-cyan-400/60 text-xs font-mono">
              {name.length}/20 characters
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 retro-button px-6 py-3 border-4 border-green-400 bg-black text-green-400 font-bold text-lg hover:bg-green-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.15em'
              }}
            >
              START
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 retro-button px-6 py-3 border-4 border-red-400 bg-black text-red-400 font-bold text-lg hover:bg-red-400 hover:text-black transition-all"
              style={{
                fontFamily: 'monospace',
                letterSpacing: '0.15em'
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-cyan-400/70 text-xs" style={{ fontFamily: 'monospace' }}>
            Press ESC to cancel
          </p>
        </div>
      </div>
    </div>
  );
}
