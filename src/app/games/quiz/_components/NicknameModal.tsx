'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
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
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError('Failed to submit. Please try again.');
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
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xs rounded-2xl p-6"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-foreground)' }}>
          Submit to Leaderboard
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--color-muted)' }}>
          Score:{' '}
          <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{score}</span>
          {' · '}
          <span style={{ fontWeight: 600 }}>{mode === 'survival' ? 'Survival' : '3 Lives'}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter a nickname"
              value={nickname}
              maxLength={20}
              autoFocus
              autoComplete="off"
              onChange={(e) => {
                setNickname(e.target.value);
                setError(null);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-colors duration-150"
              style={{
                background: 'color-mix(in srgb, var(--color-border) 40%, transparent)',
                border: `1px solid ${focused ? 'var(--color-accent)' : 'var(--color-border)'}`,
                color: 'var(--color-foreground)',
              }}
            />
            {trimmed.length > 0 && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums pointer-events-none"
                style={{ color: 'var(--color-muted)' }}
              >
                {trimmed.length}/20
              </span>
            )}
          </div>

          {error && (
            <p
              className="text-xs rounded-lg px-3 py-2"
              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors duration-150 cursor-pointer"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)',
                background: 'transparent',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-150"
              style={{
                background: isValid && !loading
                  ? 'var(--color-accent)'
                  : 'color-mix(in srgb, var(--color-accent) 35%, var(--color-border))',
                color: 'var(--color-background)',
                cursor: !isValid || loading ? 'not-allowed' : 'pointer',
                opacity: !isValid || loading ? 0.65 : 1,
              }}
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
