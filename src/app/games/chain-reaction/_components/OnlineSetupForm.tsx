'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSignInAlt 
} from '@fortawesome/free-solid-svg-icons';

interface OnlineSetupFormProps {
  onStartOnline: (mode: 'host' | 'join', name: string, code: string) => void;
  initialOnlineMode?: 'host' | 'join';
  initialRoomCode?: string;
}

export default function OnlineSetupForm({
  onStartOnline,
  initialOnlineMode,
  initialRoomCode,
}: OnlineSetupFormProps) {
  // Online-specific states
  const [onlineMode, setOnlineMode] = useState<'host' | 'join'>(initialOnlineMode || 'host');
  const [onlineName, setOnlineName] = useState<string>('Player');
  const [roomCode, setRoomCode] = useState<string>(initialRoomCode || '');

  const handleOnlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onlineMode === 'join' && roomCode.trim().length !== 6) {
      alert('Please enter a valid 6-character room code.');
      return;
    }
    const finalName = onlineName.trim() || 'Player';
    onStartOnline(onlineMode, finalName, roomCode.toUpperCase().trim());
  };

  return (
    <motion.form
      key="online-form"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleOnlineSubmit}
      className="space-y-6"
    >
      {/* Online Sub-tabs: Host vs Join */}
      <div role="group" aria-label="Host or join an online room" className="grid grid-cols-2 gap-2 border-b border-[var(--color-border)]/50 pb-2">
        <button
          type="button"
          aria-pressed={onlineMode === 'host'}
          onClick={() => setOnlineMode('host')}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            onlineMode === 'host'
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] bg-[var(--color-background)]/45 text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <FontAwesomeIcon icon={faPlus} />
          Host A Room
        </button>
        <button
          type="button"
          aria-pressed={onlineMode === 'join'}
          onClick={() => setOnlineMode('join')}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            onlineMode === 'join'
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] bg-[var(--color-background)]/45 text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <FontAwesomeIcon icon={faSignInAlt} />
          Join A Room
        </button>
      </div>

      {/* Profile Config */}
      <div className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/40 p-4 sm:p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-foreground)]">Your profile</h3>
        
        <div>
          <label htmlFor="online-player-name" className="mb-1.5 block text-sm font-medium text-[var(--color-muted)]">Nickname</label>
          <input
            id="online-player-name"
            type="text"
            required
            maxLength={20}
            autoComplete="off"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            value={onlineName}
            onChange={(e) => setOnlineName(e.target.value)}
            onBlur={(e) => {
              const trimmed = e.target.value.trim();
              setOnlineName(trimmed || 'Player');
            }}
            className="min-h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-base font-medium transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/15 sm:text-sm"
            placeholder="Your Name"
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
          You can pick your color once you&apos;re in the lobby.
        </p>
      </div>

      {/* Join Code Input (Join Mode only) */}
      {onlineMode === 'join' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/40 p-4 sm:p-5"
        >
          <label htmlFor="online-room-code" className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Enter 6-Digit Room Code
          </label>
          <input
            id="online-room-code"
            type="text"
            required
            maxLength={6}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="min-h-14 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-lg font-black tracking-[0.25em] text-center font-mono transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/15 placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"
            placeholder="E.G. X8J9L2"
          />
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-4 text-sm font-extrabold tracking-wide text-[var(--color-accent-contrast)] shadow-lg shadow-[var(--color-accent)]/20 transition-all hover:bg-[var(--color-accent-hover)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-98 cursor-pointer"
      >
        <FontAwesomeIcon icon={onlineMode === 'host' ? faPlus : faSignInAlt} />
        {onlineMode === 'host' ? 'Create Online Lobby' : 'Join Online Room'}
      </motion.button>
    </motion.form>
  );
}
