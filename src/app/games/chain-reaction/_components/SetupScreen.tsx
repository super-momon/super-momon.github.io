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

export interface SpecialCellsConfig {
  walls: number;
  portals: number;
  multipliers: number;
  blackholes: number;
}

export const DEFAULT_SPECIAL_CELLS: SpecialCellsConfig = { walls: 0, portals: 0, multipliers: 0, blackholes: 0 };

const SETUP_DESIGN_CONTRACT = `<!--
THESIS: The configured arena is the proof; refuse the form-first setup stack.
OWN-WORLD: Theme-aware surfaces, fine emerald grid lines, steel labels, and token-driven special-cell colors.
STORY: Configure a local arena or host one online; guests join by code and special-cell locations stay randomized.
FIRST VIEWPORT: Chain Reaction and mode selection lead into player setup beside a live board schematic.
FORM: User-selected Arena Blueprint, direction 1 of 3; responsive control/preview split shared by local setup and online lobby.
-->`;

interface SetupScreenProps {
  onStartGame: (players: PlayerSetup[], rows: number, cols: number, soundEnabled: boolean, turnSecondsLimit: number, specialCells: SpecialCellsConfig) => void;
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
    <>
      <template dangerouslySetInnerHTML={{ __html: SETUP_DESIGN_CONTRACT }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6"
      >
        <div className="glass-panel relative overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/50 p-4 shadow-2xl sm:rounded-3xl sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

          <div className="relative mb-7 flex items-start gap-4 sm:mb-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-[var(--color-accent)] sm:h-14 sm:w-14">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
                Chain Reaction
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
                Take control of the board by causing cascades. Place your orbs, trigger explosions, and dominate the grid.
              </p>
            </div>
          </div>

          <div
            role="group"
            aria-label="Choose game mode"
            className="relative mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            <button
              type="button"
              aria-pressed={playMode === 'local'}
              onClick={() => setPlayMode('local')}
              className={`flex min-h-16 min-w-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                playMode === 'local'
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-background)]/45 hover:border-[var(--color-accent)]/50'
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                playMode === 'local'
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)]'
              }`}>
                <FontAwesomeIcon icon={faTv} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-bold ${
                  playMode === 'local' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'
                }`}>
                  Local Play
                </span>
                <span className="mt-0.5 block text-xs text-[var(--color-muted)]">Set up players and the board</span>
              </span>
            </button>
            <button
              type="button"
              aria-pressed={playMode === 'online'}
              onClick={() => setPlayMode('online')}
              className={`flex min-h-16 min-w-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                playMode === 'online'
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-background)]/45 hover:border-[var(--color-accent)]/50'
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                playMode === 'online'
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)]'
              }`}>
                <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-bold ${
                  playMode === 'online' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'
                }`}>
                  Online Multiplayer
                </span>
                <span className="mt-0.5 block text-xs text-[var(--color-muted)]">Create a room or enter a code</span>
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
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
    </>
  );
}
