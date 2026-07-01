'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import type { GameMode } from '@/types/quiz';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { fetchLeaderboard } from '@/lib/leaderboard';

interface Props {
  initialMode: GameMode;
  highlightId?: string;
  onClose?: () => void;
}

const MEDAL = ['🥇', '🥈', '🥉'];
const ROW_COUNT = 10;

// Module-level cache — persists for the lifetime of the browser session (page load)
const leaderboardCache = new Map<GameMode, LeaderboardEntry[]>();

export function Leaderboard({ initialMode, highlightId, onClose }: Props) {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => leaderboardCache.get(initialMode) ?? []);
  const [loading, setLoading] = useState(!leaderboardCache.has(initialMode));
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const showAccuracy = mode === 'best-of-100';
  const gridTemplateColumns = showAccuracy ? '2rem 1fr 3.5rem 3.5rem 3.5rem' : '2rem 1fr 3.5rem 3.5rem';

  const refreshMode = useCallback((currentMode: GameMode) => {
    const controller = new AbortController();
    setRefreshing(true);
    setError(null);
    fetchLeaderboard(currentMode, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          leaderboardCache.set(currentMode, data);
          setEntries(data);
        }
      })
      .catch(() => { if (!controller.signal.aborted) setError('Could not load leaderboard.'); })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRefreshing(false);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (leaderboardCache.has(mode)) {
      return;
    }

    const controller = new AbortController();
    fetchLeaderboard(mode, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          leaderboardCache.set(mode, data);
          setEntries(data);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('Could not load leaderboard.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [mode]);

  const handleModeChange = (nextMode: GameMode) => {
    setMode(nextMode);
    setError(null);

    const cachedEntries = leaderboardCache.get(nextMode);
    if (cachedEntries) {
      setEntries(cachedEntries);
      setLoading(false);
      return;
    }

    setLoading(true);
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
          Leaderboard
        </h3>
        <div className="flex items-center gap-1">
          {/* Refresh */}
          <button
            onClick={() => refreshMode(mode)}
            disabled={loading || refreshing}
            title="Refresh leaderboard"
            className="flex items-center justify-center w-6 h-6 rounded-lg transition-opacity duration-200 cursor-pointer disabled:opacity-40"
            style={{ color: 'var(--color-muted)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'transform 0.4s', transform: refreshing ? 'rotate(360deg)' : 'none' }}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>

          {/* Close — only shown when rendered inside a modal */}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close leaderboard"
              className="flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-150 cursor-pointer"
              style={{
                background: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-muted)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-foreground)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'color-mix(in srgb, var(--color-border) 70%, transparent)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)';
              }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div
        className="flex mx-4 mb-3 p-1 rounded-xl gap-1"
        style={{ background: 'color-mix(in srgb, var(--color-border) 60%, transparent)' }}
      >
        {(['survival', 'lives', 'best-of-100'] as GameMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
            style={{
              background: mode === m ? 'var(--color-surface)' : 'transparent',
              color: mode === m ? 'var(--color-foreground)' : 'var(--color-muted)',
              boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {m === 'survival' ? 'Survival' : m === 'lives' ? '3 Lives' : 'Best of 100'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: ROW_COUNT }).map((_, i) => (
              <div
                key={i}
                className="h-9 rounded-xl animate-pulse"
                style={{ background: 'var(--color-border)', opacity: 1 - i * 0.1 }}
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm py-5" style={{ color: '#ef4444' }}>
            {error}
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {/* Column headers */}
            <div
              className="grid text-[10px] uppercase tracking-widest font-semibold pb-2 px-3"
              style={{
                color: 'var(--color-muted)',
                gridTemplateColumns,
              }}
            >
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Score</span>
              {showAccuracy && <span className="text-right">Acc</span>}
              <span className="text-right">Avg</span>
            </div>

            {Array.from({ length: ROW_COUNT }).map((_, idx) => {
              const entry = entries[idx] ?? null;

              if (!entry) {
                return (
                  <motion.div
                    key={`empty-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="flex items-center px-3 rounded-xl"
                    style={{
                      height: '2.625rem',
                      background: idx % 2 !== 0
                        ? 'color-mix(in srgb, var(--color-border) 10%, transparent)'
                        : 'transparent',
                    }}
                  >
                    <span
                      className="text-xs tabular-nums shrink-0"
                      style={{
                        width: '2rem',
                        color: 'color-mix(in srgb, var(--color-muted) 22%, transparent)',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: '1px',
                        background:
                          'linear-gradient(90deg, color-mix(in srgb, var(--color-border) 55%, transparent) 0%, transparent 80%)',
                        borderRadius: '1px',
                      }}
                    />
                  </motion.div>
                );
              }

              const isHighlighted = entry.id === highlightId;
              const accuracy =
                entry.total_answered > 0
                  ? Math.round((entry.correct_count / entry.total_answered) * 100)
                  : 0;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="grid items-center px-3 py-2.5 rounded-xl text-sm"
                  style={{
                    gridTemplateColumns,
                    background: isHighlighted
                      ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
                      : idx % 2 !== 0
                        ? 'color-mix(in srgb, var(--color-border) 25%, transparent)'
                        : 'transparent',
                    border: isHighlighted
                      ? '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)'
                      : '1px solid transparent',
                  }}
                >
                  {/* Rank */}
                  <span className="leading-none">
                    {idx < 3 ? (
                      <span className="text-base">{MEDAL[idx]}</span>
                    ) : (
                      <span className="text-xs tabular-nums" style={{ color: 'var(--color-muted)' }}>
                        {idx + 1}
                      </span>
                    )}
                  </span>

                  {/* Nickname */}
                  <span
                    className="font-semibold truncate pr-2"
                    style={{
                      color: isHighlighted ? 'var(--color-accent)' : 'var(--color-foreground)',
                    }}
                    title={entry.nickname}
                  >
                    {isHighlighted ? `${entry.nickname} ★` : entry.nickname}
                  </span>

                  {/* Score */}
                  <span
                    className="text-right font-bold tabular-nums"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {entry.score}
                  </span>

                  {showAccuracy && (
                    <span
                      className="text-right tabular-nums text-xs"
                      style={{
                        color: accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#eab308' : '#ef4444',
                      }}
                    >
                      {accuracy}%
                    </span>
                  )}

                  {/* Avg time */}
                  <span
                    className="text-right tabular-nums text-xs"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {Number(entry.avg_time_per_question).toFixed(1)}s
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
