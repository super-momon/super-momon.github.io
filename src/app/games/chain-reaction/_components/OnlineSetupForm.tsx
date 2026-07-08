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
      <div className="flex justify-center border-b border-[var(--color-border)]/40 pb-1 gap-6">
        <button
          type="button"
          onClick={() => setOnlineMode('host')}
          className={`pb-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            onlineMode === 'host'
              ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
              : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <FontAwesomeIcon icon={faPlus} />
          Host A Room
        </button>
        <button
          type="button"
          onClick={() => setOnlineMode('join')}
          className={`pb-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            onlineMode === 'join'
              ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
              : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <FontAwesomeIcon icon={faSignInAlt} />
          Join A Room
        </button>
      </div>

      {/* Profile Config */}
      <div className="bg-[var(--color-surface)]/30 rounded-2xl p-5 border border-[var(--color-border)]/40 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-foreground)]/80">Your Profile</h3>
        
        <div>
          <label className="text-xs text-[var(--color-muted)] block mb-1">Nickname</label>
          <input
            type="text"
            required
            maxLength={20}
            value={onlineName}
            onChange={(e) => setOnlineName(e.target.value)}
            onBlur={(e) => {
              const trimmed = e.target.value.trim();
              setOnlineName(trimmed || 'Player');
            }}
            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[var(--color-accent)] transition"
            placeholder="Your Name"
          />
        </div>

        <p className="text-[10px] text-[var(--color-muted)]">
          You can pick your color once you&apos;re in the lobby.
        </p>
      </div>

      {/* Join Code Input (Join Mode only) */}
      {onlineMode === 'join' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[var(--color-surface)]/30 rounded-2xl p-5 border border-[var(--color-border)]/40"
        >
          <label className="text-sm font-semibold text-[var(--color-foreground)]/80 block mb-2">
            Enter 6-Digit Room Code
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-lg font-black tracking-widest text-center focus:outline-none focus:border-[var(--color-accent)] transition placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"
            placeholder="E.G. X8J9L2"
          />
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-4 px-6 rounded-2xl bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] font-extrabold tracking-wide text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all cursor-pointer"
      >
        <FontAwesomeIcon icon={onlineMode === 'host' ? faPlus : faSignInAlt} />
        {onlineMode === 'host' ? 'Create Online Lobby' : 'Join Online Room'}
      </motion.button>
    </motion.form>
  );
}
