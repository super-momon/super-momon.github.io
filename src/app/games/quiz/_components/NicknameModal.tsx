'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUser, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { submitScore } from '@/lib/leaderboard';
import type { GameMode } from '@/types/quiz';
import type { LeaderboardEntry } from '@/types/leaderboard';

interface Props {
  score: number;
  mode: GameMode;
  correctCount: number;
  totalAnswered: number;
  avgTimePerQuestion: number;
  onSuccess: (entry: LeaderboardEntry) => void;
  onClose: () => void;
}

export function NicknameModal({
  score,
  mode,
  correctCount,
  totalAnswered,
  avgTimePerQuestion,
  onSuccess,
  onClose,
}: Props) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  const trimmed = nickname.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= 20;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);
    try {
      const entry = await submitScore({
        nickname: trimmed,
        score,
        mode,
        correct_count: correctCount,
        total_answered: totalAnswered,
        avg_time_per_question: avgTimePerQuestion,
      });
      onSuccess(entry);
    } catch {
      setError('Failed to submit score. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/95 backdrop-blur-xl relative overflow-hidden w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTrophy} className="text-amber-400 text-lg" />
            <h2 className="text-xl font-extrabold text-[var(--color-foreground)]">
              Submit Score
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center justify-center transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-[var(--color-surface)]/60 border border-[var(--color-border)]/60 text-center">
          <div className="text-xs uppercase font-extrabold text-[var(--color-muted)] tracking-wider mb-1">
            Your Final Score
          </div>
          <div className="text-4xl font-extrabold text-[var(--color-accent)] tabular-nums">
            {score}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-extrabold text-[var(--color-foreground)]/80 uppercase tracking-wider block mb-2">
              Enter Nickname
            </label>
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faUser} className="absolute left-3.5 text-[var(--color-muted)] text-sm pointer-events-none" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. CyberCoder"
                maxLength={20}
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 text-[var(--color-foreground)] font-bold text-sm focus:border-[var(--color-accent)] focus:outline-none transition-all"
              />
            </div>
          </div>

          {error && <p className="text-xs font-bold text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-sm transition-all cursor-pointer ${
              isValid && !loading
                ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-lg shadow-[var(--color-accent)]/20'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] cursor-not-allowed opacity-50'
            }`}
          >
            <FontAwesomeIcon icon={faCheck} />
            {loading ? 'Submitting...' : 'Submit to Leaderboard'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
