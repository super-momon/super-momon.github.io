'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTv, 
  faGlobe 
} from '@fortawesome/free-solid-svg-icons';
import LocalSetupForm from './LocalSetupForm';
import OnlineSetupForm from './OnlineSetupForm';

export interface PlayerSetup {
  id: number;
  clientId?: string;
  name: string;
  color: string;
}

interface SetupScreenProps {
  onStartGame: (players: PlayerSetup[], rows: number, cols: number, soundEnabled: boolean) => void;
  onStartOnline: (mode: 'host' | 'join', name: string, code: string) => void;
  initialPlayMode?: 'local' | 'online';
  initialOnlineMode?: 'host' | 'join';
  initialRoomCode?: string;
}

export default function SetupScreen({
  onStartGame,
  onStartOnline,
  initialPlayMode,
  initialOnlineMode,
  initialRoomCode,
}: SetupScreenProps) {
  // Main Play mode: 'local' or 'online'
  const [playMode, setPlayMode] = useState<'local' | 'online'>(initialPlayMode || 'local');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand / Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-accent)]/20"
          >
            <svg className="w-8 h-8 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)] mb-2">
            Chain Reaction
          </h1>
          <p className="text-[var(--color-muted)] text-sm max-w-md mx-auto">
            Take control of the board by causing cascades. Place your orbs, trigger explosions, and dominate the grid.
          </p>
        </div>

        {/* Tab Selector: Local vs Online */}
        <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)]/80 rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setPlayMode('local')}
            className={`flex-1 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              playMode === 'local'
                ? 'bg-[var(--color-accent)] text-white shadow-lg'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <FontAwesomeIcon icon={faTv} />
            Local Play
          </button>
          <button
            type="button"
            onClick={() => setPlayMode('online')}
            className={`flex-1 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              playMode === 'online'
                ? 'bg-[var(--color-accent)] text-white shadow-lg'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <FontAwesomeIcon icon={faGlobe} />
            Online Multiplayer
          </button>
        </div>

        <AnimatePresence mode="wait">
          {playMode === 'local' ? (
            <LocalSetupForm onStartGame={onStartGame} />
          ) : (
            <OnlineSetupForm
              onStartOnline={onStartOnline}
              initialOnlineMode={initialOnlineMode}
              initialRoomCode={initialRoomCode}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
