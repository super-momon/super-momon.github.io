'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUser, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { submitScore } from '@/lib/leaderboard';
import { useDialogFocus } from '@/hooks/useDialogFocus';
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
  const dialogRef = useDialogFocus<HTMLDivElement>(true, onClose);

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
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 p-4 backdrop-blur-[10px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nickname-dialog-title"
        tabIndex={-1}
        className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/95 backdrop-blur-xl relative overflow-hidden w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTrophy} className="text-[var(--color-status-medium)] text-lg" />
            <h2
              id="nickname-dialog-title"
              className="text-xl font-extrabold text-[var(--color-foreground)]"
            >
              Submit Score
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close nickname dialog"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-muted)] transition-all hover:text-[var(--color-foreground)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
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
            <label
              htmlFor="quiz-nickname"
              className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-[var(--color-foreground)]/80"
            >
              Enter Nickname
            </label>
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faUser} className="absolute left-3.5 text-[var(--color-muted)] text-sm pointer-events-none" />
              <input
                id="quiz-nickname"
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. CyberCoder"
                maxLength={20}
                data-dialog-autofocus
                aria-invalid={error !== null}
                aria-describedby={error ? 'nickname-error' : undefined}
                className="min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 py-3 pl-10 pr-4 text-base font-bold text-[var(--color-foreground)] transition-all focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p id="nickname-error" role="alert" className="text-xs font-bold text-[var(--color-status-extra-hard)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-sm transition-all cursor-pointer ${
              isValid && !loading
                ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-contrast)] shadow-lg shadow-[var(--color-accent)]/20'
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
