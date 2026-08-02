'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faRotateRight,
  faXmark,
  faCrown,
  faMedal,
} from '@fortawesome/free-solid-svg-icons';
import type { GameMode } from '@/types/quiz';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { fetchLeaderboard } from '@/lib/leaderboard';

interface Props {
  initialMode: GameMode;
  highlightId?: string;
  onClose?: () => void;
}

const leaderboardCache = new Map<GameMode, LeaderboardEntry[]>();

export function Leaderboard({ initialMode, highlightId, onClose }: Props) {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => leaderboardCache.get(initialMode) ?? []);
  const [loading, setLoading] = useState(!leaderboardCache.has(initialMode));
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const showAccuracy = mode === 'best-of-100';

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
      .catch(() => {
        if (!controller.signal.aborted) setError('Could not load leaderboard.');
      })
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
    <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/90 backdrop-blur-xl relative overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faTrophy} className="text-amber-400 text-lg" />
          <h3 className="text-lg font-extrabold text-[var(--color-foreground)]">
            Global Leaderboard
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshMode(mode)}
            disabled={loading || refreshing}
            title="Refresh leaderboard"
            className="w-8 h-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              className={`text-xs ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center justify-center transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs (Chain Reaction Style) */}
      <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)]/80 rounded-2xl p-1 mb-4">
        <button
          type="button"
          onClick={() => handleModeChange('survival')}
          className={`flex-1 py-2 px-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
            mode === 'survival'
              ? 'bg-[var(--color-accent)] text-white shadow-md'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          Survival
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('lives')}
          className={`flex-1 py-2 px-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
            mode === 'lives'
              ? 'bg-[var(--color-accent)] text-white shadow-md'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          3 Lives
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('best-of-100')}
          className={`flex-1 py-2 px-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
            mode === 'best-of-100'
              ? 'bg-[var(--color-accent)] text-white shadow-md'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          Best of 100
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      {loading ? (
        <div className="h-[480px] sm:h-[500px] flex items-center justify-center text-[var(--color-muted)] text-sm font-bold animate-pulse">
          Loading scores...
        </div>
      ) : error ? (
        <div className="h-[480px] sm:h-[500px] flex items-center justify-center text-red-400 text-sm font-bold">{error}</div>
      ) : entries.length === 0 ? (
        <div className="h-[480px] sm:h-[500px] flex items-center justify-center text-[var(--color-muted)] text-sm font-semibold">
          No scores recorded yet for this mode. Be the first!
        </div>
      ) : (
        <div className="space-y-2 h-[480px] sm:h-[500px] overflow-y-auto pr-1">
          {entries.map((entry, index) => {
            const isHighlight = highlightId === entry.id;
            const rank = index + 1;
            const medalColor =
              rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : '';

            return (
              <div
                key={entry.id || index}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
                  isHighlight
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 shadow-md'
                    : 'border-[var(--color-border)]/60 bg-[var(--color-surface)]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center font-extrabold text-xs font-mono shrink-0">
                    {rank <= 3 ? (
                      <FontAwesomeIcon icon={faCrown} className={medalColor} />
                    ) : (
                      <span className="text-[var(--color-muted)]">#{rank}</span>
                    )}
                  </span>
                  <span className="font-bold text-sm text-[var(--color-foreground)] truncate">
                    {entry.nickname}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  {showAccuracy && (
                    <span className="text-[var(--color-muted)]">
                      {Math.round((entry.correct_count / (entry.total_answered || 100)) * 100)}%
                    </span>
                  )}
                  <span className="font-extrabold text-[var(--color-accent)] text-sm tabular-nums">
                    {entry.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
