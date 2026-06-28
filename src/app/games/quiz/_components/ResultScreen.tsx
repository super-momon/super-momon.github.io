'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { GameMode } from '@/types/quiz';

interface Props {
  score: number;
  totalAnswered: number;
  correctCount: number;
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

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
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
  mode,
  onPlayAgain,
  onChangeMode,
}: Props) {
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const rating = getRating(accuracy);
  const displayScore = useCountUp(score);

  const accuracyColor =
    accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#eab308' : '#ef4444';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm flex flex-col items-center text-center"
      >
        {/* Icon + rating */}
        <motion.div variants={item} className="mb-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            {/* Ambient glow behind icon */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${rating.color}28 0%, transparent 70%)`,
                filter: 'blur(14px)',
                transform: 'scale(1.8)',
                pointerEvents: 'none',
              }}
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center text-5xl"
              style={{
                background: `${rating.color}12`,
                border: `1px solid ${rating.color}30`,
                boxShadow: `0 0 24px ${rating.color}22`,
              }}
            >
              {rating.icon}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Run Complete</h1>
          <p className="text-base font-semibold" style={{ color: rating.color }}>
            {rating.label}
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div
          variants={item}
          className="w-full rounded-2xl border p-8 mb-4"
          style={{
            background: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: 'var(--color-border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Animated score */}
          <div
            className="text-6xl font-bold tabular-nums mb-1"
            style={{
              color: 'var(--color-accent)',
              textShadow: '0 0 24px rgba(0,199,88,0.42)',
            }}
          >
            {displayScore}
          </div>
          <div
            className="text-[10px] uppercase tracking-widest font-semibold mb-7"
            style={{ color: 'var(--color-muted)' }}
          >
            Total Score
          </div>

          {/* Stat row */}
          <div
            className="grid grid-cols-3 gap-4 pt-6 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {[
              { value: totalAnswered, label: 'Answered', color: 'var(--color-foreground)' },
              { value: correctCount, label: 'Correct', color: '#22c55e' },
              { value: `${accuracy}%`, label: 'Accuracy', color: accuracyColor },
            ].map(({ value, label, color }) => (
              <div key={label}>
                <div
                  className="text-2xl font-bold tabular-nums"
                  style={{ color }}
                >
                  {value}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Accuracy bar */}
          <div className="mt-5">
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--color-border)' }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: accuracyColor,
                  boxShadow: `0 0 8px ${accuracyColor}80`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Mode label */}
        <motion.p
          variants={item}
          className="text-xs mb-6"
          style={{ color: 'var(--color-muted)' }}
        >
          Mode:{' '}
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>
            {mode === 'survival' ? 'Survival' : '3 Lives'}
          </span>
        </motion.p>

        {/* Actions */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 w-full">
          <motion.button
            whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={onPlayAgain}
            className="flex-1 py-4 rounded-xl font-bold text-base cursor-pointer"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-background)',
              boxShadow: '0 4px 24px rgba(0,199,88,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={onChangeMode}
            className="flex-1 py-4 rounded-xl font-bold text-base border-2 cursor-pointer transition-colors duration-200"
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
  );
}

