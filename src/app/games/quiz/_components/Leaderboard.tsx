'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { GameMode } from '@/types/quiz';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { fetchLeaderboard } from '@/lib/leaderboard';

interface Props {
  initialMode: GameMode;
  highlightId?: string;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export function Leaderboard({ initialMode, highlightId }: Props) {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchLeaderboard(mode)
      .then(setEntries)
      .catch(() => setError('Could not load leaderboard.'))
      .finally(() => setLoading(false));
  }, [mode]);

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
      <div className="flex items-center px-4 pt-4 pb-2">
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
          Leaderboard
        </h3>
      </div>

      {/* Mode toggle */}
      <div
        className="flex mx-4 mb-3 p-1 rounded-xl gap-1"
        style={{ background: 'color-mix(in srgb, var(--color-border) 60%, transparent)' }}
      >
        {(['survival', 'lives'] as GameMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
            style={{
              background: mode === m ? 'var(--color-surface)' : 'transparent',
              color: mode === m ? 'var(--color-foreground)' : 'var(--color-muted)',
              boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {m === 'survival' ? 'Survival' : '3 Lives'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 rounded-xl animate-pulse"
                style={{ background: 'var(--color-border)', opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm py-5" style={{ color: '#ef4444' }}>
            {error}
          </p>
        ) : entries.length === 0 ? (
          <p className="text-center text-sm py-5" style={{ color: 'var(--color-muted)' }}>
            No scores yet — be the first!
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {/* Column headers */}
            <div
              className="grid text-[10px] uppercase tracking-widest font-semibold pb-2 px-3"
              style={{
                color: 'var(--color-muted)',
                gridTemplateColumns: '2rem 1fr 3.5rem 3.5rem 3.5rem',
              }}
            >
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Score</span>
              <span className="text-right">Acc</span>
              <span className="text-right">Avg</span>
            </div>

            {entries.map((entry, idx) => {
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
                    gridTemplateColumns: '2rem 1fr 3.5rem 3.5rem 3.5rem',
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

                  {/* Accuracy */}
                  <span
                    className="text-right tabular-nums text-xs"
                    style={{
                      color:
                        accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#eab308' : '#ef4444',
                    }}
                  >
                    {accuracy}%
                  </span>

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
