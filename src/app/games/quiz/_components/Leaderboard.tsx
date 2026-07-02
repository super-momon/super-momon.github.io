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
            aria-label="Refresh leaderboard"
            className="flex items-center justify-center w-6 h-6 rounded-lg transition-opacity duration-200 cursor-pointer disabled:opacity-40 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
              aria-hidden="true"
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
              className="flex items-center justify-center w-6 h-6 rounded-lg transition-[background-color,color,box-shadow] duration-150 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
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
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-[background-color,color,box-shadow] duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background"
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
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr
                className="text-[10px] uppercase tracking-widest font-semibold border-b border-border/30"
                style={{ color: 'var(--color-muted)' }}
              >
                <th className="pb-2 px-3 text-left font-semibold w-8">#</th>
                <th className="pb-2 px-3 text-left font-semibold">Player</th>
                <th className="pb-2 px-3 text-right font-semibold w-14">Score</th>
                {showAccuracy && <th className="pb-2 px-3 text-right font-semibold w-14">Acc</th>}
                <th className="pb-2 px-3 text-right font-semibold w-14">Avg</th>
              </tr>
            </thead>
            <tbody className="before:block before:h-1.5">
              {Array.from({ length: ROW_COUNT }).map((_, idx) => {
                const entry = entries[idx] ?? null;

                if (!entry) {
                  return (
                    <motion.tr
                      key={`empty-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      style={{
                        background: idx % 2 !== 0
                          ? 'color-mix(in srgb, var(--color-border) 10%, transparent)'
                          : 'transparent',
                      }}
                      className="h-10 border-b border-border/10 last:border-b-0"
                    >
                      <td className="px-3 text-xs tabular-nums w-8" style={{ color: 'color-mix(in srgb, var(--color-muted) 22%, transparent)' }}>
                        {idx + 1}
                      </td>
                      <td className="px-3" colSpan={showAccuracy ? 4 : 3}>
                        <div
                          style={{
                            height: '1px',
                            background:
                              'linear-gradient(90deg, color-mix(in srgb, var(--color-border) 55%, transparent) 0%, transparent 80%)',
                            borderRadius: '1px',
                            width: '50%',
                          }}
                        />
                      </td>
                    </motion.tr>
                  );
                }

                const isHighlighted = entry.id === highlightId;
                const accuracy =
                  mode === 'best-of-100'
                    ? Math.round(
                        (entry.correct_count /
                          (entry.total_answered < 100 && entry.correct_count < entry.total_answered
                            ? 100
                            : entry.total_answered)) *
                          100
                      )
                    : entry.total_answered > 0
                      ? Math.round((entry.correct_count / entry.total_answered) * 100)
                      : 0;

                return (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="text-sm h-10 border-b border-border/10 last:border-b-0 transition-colors duration-150 hover:bg-border/20"
                    style={{
                      background: isHighlighted
                        ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
                        : idx % 2 !== 0
                          ? 'color-mix(in srgb, var(--color-border) 25%, transparent)'
                          : 'transparent',
                      outline: isHighlighted
                        ? '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)'
                        : 'none',
                    }}
                  >
                    {/* Rank */}
                    <td className="px-3 font-medium w-8">
                      {idx < 3 ? (
                        <span role="img" aria-label={`Rank ${idx + 1}`} className="text-base">{MEDAL[idx]}</span>
                      ) : (
                        <span className="text-xs tabular-nums text-muted">{idx + 1}</span>
                      )}
                    </td>

                    {/* Nickname */}
                    <td
                      className="px-3 font-semibold truncate max-w-[140px] sm:max-w-none"
                      style={{
                        color: isHighlighted ? 'var(--color-accent)' : 'var(--color-foreground)',
                      }}
                      title={entry.nickname}
                    >
                      {isHighlighted ? `${entry.nickname} ★` : entry.nickname}
                    </td>

                    {/* Score */}
                    <td className="px-3 text-right font-bold tabular-nums text-accent w-14">
                      {entry.score}
                    </td>

                    {showAccuracy && (
                      <td
                        className="px-3 text-right tabular-nums text-xs font-semibold w-14"
                        style={{
                          color: accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#eab308' : '#ef4444',
                        }}
                      >
                        {accuracy}%
                      </td>
                    )}

                    {/* Avg time */}
                    <td className="px-3 text-right tabular-nums text-xs text-muted w-14">
                      {Number(entry.avg_time_per_question).toFixed(1)}s
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
