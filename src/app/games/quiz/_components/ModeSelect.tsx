'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import type { GameMode } from '@/types/quiz';

interface Props {
  onStart: (mode: GameMode) => void;
  onOpenLeaderboard: () => void;
}

const MODES = [
  {
    id: 'survival' as GameMode,
    label: 'Survival',
    tagline: 'One strike and it\'s over',
    description:
      'Answer correctly without stopping. A single wrong answer — or a timeout — ends your run. Only the sharpest survive.',
    icon: '⚡',
    accentClass: 'text-orange-500',
    borderActive: 'border-orange-500/70',
    glow: '0 0 32px rgba(249,115,22,0.25)',
    bg: 'rgba(249,115,22,0.07)',
    orb: 'rgba(249,115,22,0.22)',
  },
  {
    id: 'lives' as GameMode,
    label: '3 Lives',
    tagline: 'Three strikes before the end',
    description:
      'You have three lives. Each wrong answer or timeout costs one. When all three are gone, the run ends.',
    icon: '❤️',
    accentClass: 'text-blue-500',
    borderActive: 'border-blue-500/70',
    glow: '0 0 32px rgba(59,130,246,0.25)',
    bg: 'rgba(59,130,246,0.07)',
    orb: 'rgba(59,130,246,0.22)',
  },
  {
    id: 'best-of-100' as GameMode,
    label: 'Best of 100',
    tagline: 'Score as high as you can',
    description:
      'A fixed set of 100 questions — no sudden death, no lives. Answer every question and see how high you can score.',
    icon: '💯',
    accentClass: 'text-purple-500',
    borderActive: 'border-purple-500/70',
    glow: '0 0 32px rgba(168,85,247,0.25)',
    bg: 'rgba(168,85,247,0.07)',
    orb: 'rgba(168,85,247,0.22)',
  },
] as const;

const SCORING = [
  { label: 'Easy', pts: '+1', color: 'text-green-500' },
  { label: 'Medium', pts: '+2', color: 'text-yellow-500' },
  { label: 'Hard', pts: '+3', color: 'text-orange-500' },
  { label: 'X-Hard', pts: '+5', color: 'text-red-500' },
];

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export function ModeSelect({ onStart, onOpenLeaderboard }: Props) {
  const [selected, setSelected] = useState<GameMode | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl flex flex-col items-center"
      >
        {/* Eyebrow + Title */}
        <motion.div variants={item} className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs uppercase tracking-widest font-semibold mb-6"
            style={{
              borderColor: 'rgba(0,199,88,0.35)',
              background: 'rgba(0,199,88,0.07)',
              color: 'var(--color-muted)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
              style={{ background: 'var(--color-accent)', boxShadow: '0 0 7px rgba(0,199,88,0.8)' }}
            />
            Programming Quiz
          </div>
          <h1
            className="font-bold tracking-tight text-foreground mb-3 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
          >
            Choose your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-accent) 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              challenge
            </span>
          </h1>
          <p className="text-muted text-base max-w-xs mx-auto leading-relaxed">
            Questions are endless — only your mistakes will stop the run.
          </p>
        </motion.div>

        {/* Mode Cards */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6"
        >
          {MODES.map((m) => {
            const isSelected = selected === m.id;
            return (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(m.id)}
                className={[
                  'relative p-6 rounded-2xl border-2 text-left cursor-pointer overflow-hidden',
                  isSelected ? m.borderActive : 'border-border',
                ].join(' ')}
                style={{
                  background: isSelected
                    ? m.bg
                    : 'color-mix(in srgb, var(--color-surface) 80%, transparent)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: isSelected
                    ? m.glow
                    : '0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
                  transition: 'border-color 0.2s, box-shadow 0.25s, background 0.2s',
                }}
              >
                {/* Inner glow orb when selected */}
                {isSelected && (
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: '-30%',
                      right: '-20%',
                      width: '55%',
                      aspectRatio: '1',
                      background: `radial-gradient(circle, ${m.orb} 0%, transparent 70%)`,
                      filter: 'blur(20px)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-accent)', boxShadow: '0 0 10px rgba(0,199,88,0.5)' }}
                  >
                    <svg className="w-3 h-3" style={{ color: 'var(--color-background)' }} viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                )}

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg transition-all duration-300"
                  style={{
                    background: isSelected ? m.bg : 'var(--color-background)',
                    border: `1px solid ${isSelected ? 'transparent' : 'var(--color-border)'}`,
                    boxShadow: isSelected ? m.glow.replace('32px', '12px') : 'none',
                  }}
                >
                  {m.icon}
                </div>

                <div className="font-bold text-base text-foreground mb-1">{m.label}</div>
                <div className={`text-xs font-semibold mb-3 ${m.accentClass}`}>{m.tagline}</div>
                <p className="text-xs text-muted leading-relaxed">{m.description}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Scoring legend */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-5 mb-8 py-3 px-6 rounded-xl w-full"
          style={{
            border: '1px solid var(--color-border)',
            background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <span className="text-xs text-muted uppercase tracking-widest font-medium hidden sm:block">
            Points
          </span>
          <div className="flex items-center gap-5">
            {SCORING.map(({ label, pts, color }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className={`text-sm font-bold tabular-nums ${color}`}>{pts}</span>
                <span className="text-[10px] text-muted leading-none">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="flex flex-col items-center gap-3">
          <motion.button
            disabled={!selected}
            onClick={() => selected && onStart(selected)}
            whileHover={selected ? { scale: 1.03, y: -1, transition: { duration: 0.15 } } : undefined}
            whileTap={selected ? { scale: 0.97 } : undefined}
            className={[
              'relative px-14 py-4 rounded-xl font-bold text-base tracking-wide overflow-hidden transition-all duration-200',
              selected
                ? 'cursor-pointer'
                : 'bg-surface border border-border text-muted cursor-not-allowed',
            ].join(' ')}
            style={
              selected
                ? {
                  background: 'var(--color-accent)',
                  color: 'var(--color-background)',
                  boxShadow: '0 4px 28px rgba(0,199,88,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
                }
                : undefined
            }
          >
            {selected && (
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2.4s ease-in-out infinite',
                }}
              />
            )}
            <span className="relative">{selected ? 'Begin Run →' : 'Select a Mode'}</span>
          </motion.button>

          {/* Leaderboard trigger */}
          <motion.button
            onClick={onOpenLeaderboard}
            whileHover={{ scale: 1.03, y: -1, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
            style={{
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted)',
              background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'color-mix(in srgb, var(--color-accent) 40%, var(--color-border))';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-foreground)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
              <rect x="1" y="6" width="3" height="7" rx="0.75" fill="currentColor" opacity="0.6" />
              <rect x="5.5" y="3" width="3" height="10" rx="0.75" fill="currentColor" opacity="0.8" />
              <rect x="10" y="1" width="3" height="12" rx="0.75" fill="currentColor" />
            </svg>
            Leaderboard
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

