'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { GameMode } from '@/types/quiz';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { NicknameModal } from './NicknameModal';
import { LeaderboardModal } from './LeaderboardModal';

interface Props {
  score: number;
  totalAnswered: number;
  correctCount: number;
  totalQuestions: number;
  avgSecondsPerQuestion: number;
  maxStreak?: number;
  mode: GameMode;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}

function getRating(accuracy: number) {
  if (accuracy >= 90) return { label: 'Legendary', icon: '🏆', color: '#f59e0b' };
  if (accuracy >= 75) return { label: 'Expert', icon: '🎯', color: '#a78bfa' };
  if (accuracy >= 60) return { label: 'Solid Run', icon: '🔷', color: '#60a5fa' };
  if (accuracy >= 40) return { label: 'Keep Grinding', icon: '📈', color: '#f97316' };
  return { label: 'Keep Learning', icon: '📚', color: '#ef4444' };
}

function getSpeedRank(avgSeconds: number) {
  if (avgSeconds <= 0) return { label: 'Instant', icon: '⚡' };
  if (avgSeconds <= 3.5) return { label: 'Lightning Fast', icon: '⚡' };
  if (avgSeconds <= 6) return { label: 'Swift Thinker', icon: '🚀' };
  if (avgSeconds <= 9) return { label: 'Methodical', icon: '🧠' };
  return { label: 'Deliberate', icon: '🐢' };
}

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
}

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function ResultScreen({
  score,
  totalAnswered,
  correctCount,
  totalQuestions,
  avgSecondsPerQuestion,
  maxStreak = 0,
  mode,
  onPlayAgain,
  onChangeMode,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<LeaderboardEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const accuracy =
    mode === 'best-of-100'
      ? totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0
      : totalAnswered > 0
        ? Math.round((correctCount / totalAnswered) * 100)
        : 0;

  const rating = getRating(accuracy);
  const speedRank = getSpeedRank(avgSecondsPerQuestion);
  const displayScore = useCountUp(score);
  const accuracyColor =
    accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#eab308' : '#ef4444';

  const modeLabel =
    mode === 'survival' ? 'Survival' : mode === 'lives' ? '3 Lives' : 'Best of 100';

  const stats = [
    { value: totalAnswered, label: 'Answered', color: 'var(--color-foreground)' },
    { value: correctCount, label: 'Correct', color: '#22c55e' },
    { value: maxStreak, label: 'Max Streak', color: '#f59e0b' },
    { value: `${avgSecondsPerQuestion}s`, label: 'Avg Speed', color: '#60a5fa' },
  ];

  const handleCopyShare = () => {
    const text = `🏆 Quizzed on ${modeLabel} in AI & Web Dev Quiz!\nScore: ${score} | Accuracy: ${accuracy}% | Max Streak: 🔥 ${maxStreak}\nCan you beat my score? https://super-momon.github.io/games/quiz`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-28 sm:pt-32 md:pt-36 pb-20 px-4 sm:px-6">
      <div className="w-full" style={{ maxWidth: '480px' }}>
        <div className="w-full flex flex-col items-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full flex flex-col items-center text-center"
          >
            {/* Icon + rating */}
            <motion.div variants={item} className="mb-6">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${rating.color}35 0%, transparent 70%)`,
                    filter: 'blur(16px)',
                    transform: 'scale(1.8)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-xl"
                  style={{
                    background: `${rating.color}15`,
                    border: `1px solid ${rating.color}40`,
                    boxShadow: `0 0 28px ${rating.color}25`,
                  }}
                >
                  <span aria-hidden="true">{rating.icon}</span>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-foreground mb-1">Run Complete</h1>
              <div className="flex items-center justify-center gap-2">
                <span className="text-base font-bold" style={{ color: rating.color }}>
                  {rating.label}
                </span>
                <span className="text-muted/40">•</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-muted">
                  {speedRank.icon} {speedRank.label}
                </span>
              </div>
            </motion.div>

            {/* Score card */}
            <motion.div
              variants={item}
              className="w-full rounded-3xl border p-7 mb-4 relative overflow-hidden"
              style={{
                background: 'color-mix(in srgb, var(--color-surface) 85%, transparent)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'var(--color-border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent pointer-events-none rounded-3xl" />

              <div className="relative z-10">
                {/* Animated score */}
                <div
                  className="text-6xl font-black tabular-nums mb-1 tracking-tight"
                  style={{
                    color: 'var(--color-accent)',
                    textShadow: '0 0 24px rgba(0,199,88,0.45)',
                  }}
                >
                  {displayScore}
                </div>
                <div
                  className="text-[10px] uppercase tracking-widest font-extrabold mb-6"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Total Score
                </div>

                {/* Stat grid */}
                <div
                  className="grid grid-cols-4 gap-2 pt-5 border-t"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {stats.map(({ value, label, color }) => (
                    <div key={label} className="flex flex-col items-center">
                      <div className="text-xl font-extrabold tabular-nums" style={{ color }}>
                        {value}
                      </div>
                      <div className="text-[10px] uppercase font-semibold mt-1 text-muted tracking-wider">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Accuracy bar */}
                <div className="mt-5">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-muted">Accuracy</span>
                    <span style={{ color: accuracyColor }}>{accuracy}%</span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-border)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: accuracyColor,
                        boxShadow: `0 0 10px ${accuracyColor}80`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mode & Share bar */}
            <motion.div variants={item} className="flex items-center justify-between w-full px-1 mb-4 gap-2">
              <p className="text-xs text-muted">
                Mode: <span className="font-semibold text-foreground">{modeLabel}</span>
              </p>

              <button
                type="button"
                onClick={handleCopyShare}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.224-.08 2.213-.1 4.542.44 6.1 2.015 1.576 1.576 2.115 3.905 2.015 6.1-.023.476-.05.851-.08 1.224-1.094 1.131-2.057 1.976-3.192 1.976H15M8.25 7.5h6m-6 0h-3.375c-1.135 0-2.098.845-2.192 1.976-.03.373-.057.748-.08 1.224-.1 2.213.44 4.542 2.015 6.1 1.576 1.576 3.905 2.115 6.1 2.015.476-.023.851-.05 1.224-.08 1.131-1.094 1.976-2.057 1.976-3.192V15.75m-6-8.25v6" />
                </svg>
                {copied ? 'Copied to Clipboard! ✓' : 'Share Result'}
              </button>
            </motion.div>

            {/* Submit + Leaderboard toggle */}
            {totalAnswered > 0 && (
              <motion.div variants={item} className="flex gap-2.5 w-full mb-4">
                {submittedEntry ? (
                  <div
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-center"
                    style={{
                      background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    ✓ Score Submitted
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(true)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-[background-color,border-color,color,box-shadow] outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background"
                    style={{
                      background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    Submit Score
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowLeaderboard((v) => !v)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-[background-color,border-color,color] outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background"
                  style={{
                    background: showLeaderboard
                      ? 'color-mix(in srgb, var(--color-foreground) 10%, transparent)'
                      : 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {showLeaderboard ? 'Hide Leaderboard' : 'Leaderboard'}
                </motion.button>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 w-full">
              <motion.button
                whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={onPlayAgain}
                className="flex-1 py-4 rounded-2xl font-extrabold text-base cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-background)',
                  boxShadow: '0 6px 28px rgba(0,199,88,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                Play Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={onChangeMode}
                className="flex-1 py-4 rounded-2xl font-extrabold text-base border-2 cursor-pointer transition-[border-color,color,background-color] duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                  background: 'transparent',
                }}
              >
                Change Mode
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <LeaderboardModal
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        initialMode={mode}
        highlightId={submittedEntry?.id}
      />

      {/* Nickname modal */}
      <AnimatePresence>
        {showModal && (
          <NicknameModal
            score={score}
            mode={mode}
            correctCount={correctCount}
            totalAnswered={mode === 'best-of-100' ? totalQuestions : totalAnswered}
            avgTimePerQuestion={avgSecondsPerQuestion}
            onSuccess={(entry) => {
              setSubmittedEntry(entry);
              setShowModal(false);
              setShowLeaderboard(true);
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
