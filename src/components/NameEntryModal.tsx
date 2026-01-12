'use client';
import { useState, useEffect } from 'react';

interface NameEntryModalProps {
  onNameSubmit: (name: string) => void;
  existingName?: string;
}

export default function NameEntryModal({ onNameSubmit, existingName }: NameEntryModalProps) {
  const [name, setName] = useState(existingName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingName) {
      setName(existingName);
    }
  }, [existingName]);

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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm px-4">
      <div className="retro-box border-4 border-green-400 bg-black p-6 md:p-8 max-w-md w-full">
        <h2 
          className="text-3xl md:text-4xl font-bold text-green-400 mb-6 text-center" 
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}
        >
          ENTER NAME
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="PLAYER NAME"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 border-4 border-green-400 bg-black text-green-400 font-mono text-lg focus:outline-none focus:border-cyan-400 transition-colors uppercase placeholder:text-green-400/50"
              style={{ letterSpacing: '0.1em' }}
            />
            {error && (
              <p className="text-red-400 font-mono text-sm mt-2" style={{ letterSpacing: '0.05em' }}>
                {error}
              </p>
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
        
        <div className="mt-4 text-center text-green-400/70 text-xs font-mono">
          Your name will be saved for this session
        </div>
      </div>
    </div>
  );
}
