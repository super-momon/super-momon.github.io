'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { GameMode, QuestionDifficulty } from '@/types/quiz';
import { CATEGORY_LABELS, type CategoryKey } from '@/data/quiz';

interface Props {
  onStart: (mode: GameMode, categories: CategoryKey[], difficulties: QuestionDifficulty[]) => void;
  onOpenLeaderboard: () => void;
}

// ─── Visual Configuration ──────────────────────────────────────────────────

const MODES_CONFIG = {
  survival: {
    id: 'survival' as GameMode,
    label: 'Survival',
    tagline: 'One strike ends it all',
    description:
      'Answer every question correctly without stopping. A single wrong answer or timeout ends your run instantly.',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.18)',
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  lives: {
    id: 'lives' as GameMode,
    label: '3 Lives',
    tagline: 'Three chances to survive',
    description:
      'Start with three hearts. Each mistake or timeout costs one. Lose all three and the run is over.',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.18)',
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  'best-of-100': {
    id: 'best-of-100' as GameMode,
    label: 'Best of 100',
    tagline: 'Climb the leaderboard',
    description:
      'A fixed marathon of 100 questions. No sudden death — just answer every question and chase a high score.',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.18)',
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
} as const;

const MODES_LIST = [MODES_CONFIG.survival, MODES_CONFIG.lives, MODES_CONFIG['best-of-100']];

const DIFFICULTY_CONFIG = {
  easy: {
    id: 'easy' as QuestionDifficulty,
    label: 'Easy',
    pts: '+1',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.15)',
    bars: 1,
  },
  medium: {
    id: 'medium' as QuestionDifficulty,
    label: 'Medium',
    pts: '+2',
    color: '#eab308',
    glow: 'rgba(234,179,8,0.15)',
    bars: 2,
  },
  hard: {
    id: 'hard' as QuestionDifficulty,
    label: 'Hard',
    pts: '+3',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
    bars: 3,
  },
  'extra-hard': {
    id: 'extra-hard' as QuestionDifficulty,
    label: 'X-Hard',
    pts: '+5',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.15)',
    bars: 4,
  },
} as const;

const DIFFICULTY_LIST = [
  DIFFICULTY_CONFIG.easy,
  DIFFICULTY_CONFIG.medium,
  DIFFICULTY_CONFIG.hard,
  DIFFICULTY_CONFIG['extra-hard'],
];

const CATEGORY_ACCENT: Record<CategoryKey, { light: string; dark: string }> = {
  javascript: { light: '#ca8a04', dark: '#facc15' },
  typescript: { light: '#2563eb', dark: '#60a5fa' },
  python: { light: '#1d4ed8', dark: '#38bdf8' },
  react: { light: '#0ea5e9', dark: '#22d3ee' },
  'css-html': { light: '#c2410c', dark: '#fb923c' },
  'data-structures': { light: '#7c3aed', dark: '#a78bfa' },
  'ui-ux': { light: '#db2777', dark: '#f472b6' },
  databases: { light: '#0e7490', dark: '#22d3ee' },
  git: { light: '#dc2626', dark: '#f87171' },
  'general-cs': { light: '#15803d', dark: '#4ade80' },
  dotnet: { light: '#5b21b6', dark: '#a78bfa' },
  aws: { light: '#b45309', dark: '#fbbf24' },
};

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

// ─── Magnetic Button Hook ──────────────────────────────────────────────────

function useMagneticButton<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onLeave = () => {
      el.style.transform = 'translate(0, 0)';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, prefersReducedMotion]);

  return ref;
}

// ─── Components ────────────────────────────────────────────────────────────

function StepHeading({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col mb-3 w-full">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold font-mono bg-accent/15 dark:bg-accent/20 border border-accent/25 dark:border-accent/30 text-accent shrink-0">
          {number}
        </span>
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-foreground">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 pl-10 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FilterToggle({
  allLabel,
  noneLabel,
  isAll,
  onAll,
  onNone,
  groupId,
}: {
  allLabel: string;
  noneLabel: string;
  isAll: boolean;
  onAll: () => void;
  onNone: () => void;
  groupId: string;
}) {
  return (
    <div
      className="flex items-center shrink-0 p-1 rounded-xl border bg-surface/60 dark:bg-surface/40"
      style={{ borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)' }}
    >
      <button
        type="button"
        onClick={onAll}
        className={[
          'relative px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer',
          isAll ? 'text-background' : 'text-muted hover:text-foreground',
        ].join(' ')}
      >
        {isAll && (
          <motion.span
            layoutId={`filter-toggle-pill-${groupId}`}
            className="absolute inset-0 rounded-lg"
            style={{ background: 'var(--color-accent)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{allLabel}</span>
      </button>
      <button
        type="button"
        onClick={onNone}
        className={[
          'relative px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer',
          !isAll ? 'text-background' : 'text-muted hover:text-foreground',
        ].join(' ')}
      >
        {!isAll && (
          <motion.span
            layoutId={`filter-toggle-pill-${groupId}`}
            className="absolute inset-0 rounded-lg"
            style={{ background: 'var(--color-accent)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{noneLabel}</span>
      </button>
    </div>
  );
}

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-[-20%] left-[-15%] w-[60%] aspect-square rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,199,88,0.08) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-[-25%] right-[-15%] w-[55%] aspect-square rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[40%] aspect-square rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}

export function ModeSelect({ onStart, onOpenLeaderboard }: Props) {
  const [selected, setSelected] = useState<GameMode | null>(null);
  const [selectedCats, setSelectedCats] = useState<CategoryKey[]>(Object.keys(CATEGORY_LABELS) as CategoryKey[]);
  const [selectedDiffs, setSelectedDiffs] = useState<QuestionDifficulty[]>(['easy', 'medium', 'hard', 'extra-hard']);
  const ctaRef = useMagneticButton<HTMLButtonElement>(0.15);
  const prefersReducedMotion = useReducedMotion();

  const canStart = selected && selectedCats.length > 0 && selectedDiffs.length > 0;

  const toggleCategory = (cat: CategoryKey) => {
    setSelectedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const toggleDifficulty = (diff: QuestionDifficulty) => {
    setSelectedDiffs((prev) => (prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-24 md:pt-32 pb-20 px-4 select-none">
      <AmbientBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-6xl flex flex-col items-center"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-14 flex flex-col items-center">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-7"
            style={{
              borderColor: 'rgba(0,199,88,0.22)',
              background: 'rgba(0,199,88,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--color-accent)', boxShadow: '0 0 10px rgba(0,199,88,0.8)' }}
            />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">
              Programming Quiz
            </span>
          </motion.div>

          <h1
            className="font-extrabold tracking-tight text-foreground mb-4 leading-[1.05] text-balance"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
          >
            Choose your{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-hover pb-1 inline-block italic">
              challenge
            </span>
          </h1>

          <p className="text-muted text-sm md:text-base max-w-lg leading-relaxed mb-7">
            Pick a game mode, filter your topics, and set the difficulty. Every run is a chance to climb the leaderboard.
          </p>

          <motion.button
            onClick={onOpenLeaderboard}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer border border-border bg-surface/80 dark:bg-surface/30 hover:border-accent/40 text-muted hover:text-foreground transition-all duration-300 backdrop-blur-md shadow-sm"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-muted group-hover:text-foreground transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            View Leaderboard
          </motion.button>

          <div className="w-16 h-px mt-8 bg-linear-to-r from-transparent via-accent to-transparent" />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-stretch">
          {/* Mode Selection */}
          <motion.div
            variants={item}
            className="lg:col-span-5 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden"
            style={{
              background: 'color-mix(in srgb, var(--color-surface) 96%, transparent)',
              backdropFilter: 'blur(20px)',
              border: '1px solid color-mix(in srgb, var(--color-border) 80%, transparent)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-white/10 dark:from-white/6 to-transparent pointer-events-none rounded-3xl" />

            <div className="relative z-10 flex flex-col h-full gap-6">
              <StepHeading
                number="1"
                title="Select Game Mode"
                subtitle="Each mode changes how you score, survive, and compete."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {MODES_LIST.map((m) => {
                  const isSelected = selected === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      onClick={() => setSelected(m.id)}
                      whileHover={prefersReducedMotion ? undefined : { y: -3, transition: { duration: 0.2 } }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                      className={[
                        'group relative p-5 rounded-2xl border text-left cursor-pointer overflow-hidden transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        isSelected
                          ? 'border-transparent'
                          : 'border-border bg-surface/60 dark:bg-surface/40 hover:border-slate-300 dark:hover:border-slate-600 dark:hover:bg-surface/50',
                      ].join(' ')}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${m.glow} 0%, color-mix(in srgb, var(--color-surface) 90%, transparent) 100%)`
                          : undefined,
                        boxShadow: isSelected ? `0 0 0 1px ${m.color}40, 0 12px 40px ${m.glow}` : undefined,
                      }}
                    >
                      {/* Hover fill */}
                      {!isSelected && (
                        <span className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      )}

                      {/* Selected checkmark */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: m.color }}
                          >
                            <svg className="w-3 h-3" style={{ color: '#fff' }} viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-row sm:flex-col lg:flex-row gap-4 items-start pr-7 sm:pr-0 lg:pr-7">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                          style={{
                            background: isSelected ? 'var(--color-background)' : 'rgba(100,116,139,0.10)',
                            border: isSelected ? `1px solid ${m.color}` : '1px solid var(--color-border)',
                            color: isSelected ? m.color : 'var(--color-muted)',
                            boxShadow: isSelected ? `0 0 16px ${m.glow}` : undefined,
                          }}
                        >
                          {m.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col xl:flex-row xl:items-baseline gap-0.5 xl:gap-2 mb-1">
                            <span className="font-bold text-sm text-foreground">{m.label}</span>
                            <span
                              className="text-[10px] font-extrabold tracking-wider uppercase shrink-0"
                              style={{ color: m.color }}
                            >
                              {m.tagline}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{m.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Customizations */}
          <motion.div
            variants={item}
            className="lg:col-span-7 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden"
            style={{
              background: 'color-mix(in srgb, var(--color-surface) 96%, transparent)',
              backdropFilter: 'blur(20px)',
              border: '1px solid color-mix(in srgb, var(--color-border) 80%, transparent)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-white/10 dark:from-white/6 to-transparent pointer-events-none rounded-3xl" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              {/* Categories */}
              <div className="w-full flex flex-col">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <StepHeading
                    number="2"
                    title="Filter Categories"
                    subtitle="Include only the topics you want to be quizzed on."
                  />
                  <FilterToggle
                    allLabel="All"
                    noneLabel="None"
                    isAll={selectedCats.length === Object.keys(CATEGORY_LABELS).length}
                    onAll={() => setSelectedCats(Object.keys(CATEGORY_LABELS) as CategoryKey[])}
                    onNone={() => setSelectedCats([])}
                    groupId="categories"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((cat) => {
                    const active = selectedCats.includes(cat);
                    const accent = CATEGORY_ACCENT[cat];
                    return (
                      <motion.button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        whileHover={prefersReducedMotion ? undefined : { y: -2, transition: { duration: 0.15 } }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                        className={[
                          'relative px-3 py-2.5 rounded-xl text-[11px] font-semibold cursor-pointer border text-center transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden',
                          active
                            ? 'border-transparent text-foreground font-bold'
                            : 'border-border/70 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:text-foreground dark:hover:border-slate-600 bg-surface/50 dark:bg-surface/40 dark:hover:bg-surface/50',
                        ].join(' ')}
                        style={{
                          background: active ? `color-mix(in srgb, ${accent.light}18, transparent)` : undefined,
                          boxShadow: active ? `0 0 0 1px ${accent.light}50, inset 0 1px 0 ${accent.light}20` : undefined,
                        }}
                      >
                        {!active && (
                          <span className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        )}
                        <span className="relative flex items-center justify-center gap-1.5 w-full">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200"
                            style={{
                              background: active ? accent.light : 'transparent',
                              boxShadow: active ? `0 0 6px ${accent.light}` : undefined,
                            }}
                          />
                          <span className="block text-center truncate">{CATEGORY_LABELS[cat]}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulties */}
              <div className="w-full flex flex-col">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <StepHeading
                    number="3"
                    title="Filter Difficulties"
                    subtitle="Higher difficulty means more points per correct answer."
                  />
                  <FilterToggle
                    allLabel="All"
                    noneLabel="None"
                    isAll={selectedDiffs.length === DIFFICULTY_LIST.length}
                    onAll={() => setSelectedDiffs(['easy', 'medium', 'hard', 'extra-hard'])}
                    onNone={() => setSelectedDiffs([])}
                    groupId="difficulties"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DIFFICULTY_LIST.map(({ id, label, pts, color, glow, bars }) => {
                    const active = selectedDiffs.includes(id);
                    return (
                      <motion.button
                        key={id}
                        type="button"
                        onClick={() => toggleDifficulty(id)}
                        whileHover={prefersReducedMotion ? undefined : { y: -2, transition: { duration: 0.15 } }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                        className={[
                          'group/diff relative p-4 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden',
                          active
                            ? 'border-transparent text-foreground font-black'
                            : 'border-border/70 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 bg-surface/50 dark:bg-surface/40 dark:hover:bg-surface/50',
                        ].join(' ')}
                        style={{
                          background: active ? `color-mix(in srgb, ${color}14, transparent)` : undefined,
                          boxShadow: active ? `0 0 0 1px ${color}55, 0 8px 24px ${glow}` : undefined,
                        }}
                      >
                        {!active && (
                          <span className="absolute inset-0 bg-accent/5 opacity-0 group-hover/diff:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        )}

                        <div
                          className={[
                            'absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[8px] font-extrabold tracking-wide transition-all duration-200',
                            active ? 'text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
                          ].join(' ')}
                          style={{ background: active ? color : undefined }}
                        >
                          {pts}
                        </div>

                        <div className="flex flex-col items-center pt-3.5">
                          <div className="flex gap-0.5 items-end h-3 mb-2 opacity-90">
                            {[1, 2, 3, 4].map((i) => {
                              const filled = i <= bars;
                              return (
                                <span
                                  key={i}
                                  className="w-0.75 rounded-full transition-all duration-300"
                                  style={{
                                    height: `${i * 25}%`,
                                    background: filled ? color : 'color-mix(in srgb, var(--color-border) 60%, transparent)',
                                    boxShadow: filled && active ? `0 0 6px ${color}` : undefined,
                                  }}
                                />
                              );
                            })}
                          </div>
                          <span className={`text-[10px] font-extrabold tracking-wider uppercase ${active ? 'text-foreground' : 'text-slate-600/80 dark:text-slate-300/80'}`}>
                            {label}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center lg:items-end gap-3 mt-2">
                <button
                  ref={ctaRef}
                  disabled={!canStart}
                  onClick={() => canStart && onStart(selected, selectedCats, selectedDiffs)}
                  className={[
                    'group/btn relative px-16 py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background w-full sm:w-auto will-change-transform',
                    canStart
                      ? 'cursor-pointer'
                      : 'bg-surface border border-border text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60',
                  ].join(' ')}
                  style={
                    canStart
                      ? {
                        background: 'var(--color-accent)',
                        color: 'var(--color-background)',
                        boxShadow: '0 10px 40px rgba(0,199,88,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }
                      : undefined
                  }
                >
                  {canStart && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 animate-shimmer"
                      style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    <span>
                      {!selected
                        ? 'Select a Mode'
                        : selectedCats.length === 0
                          ? 'Choose Categories'
                          : selectedDiffs.length === 0
                            ? 'Choose Difficulty'
                            : 'Begin Run'}
                    </span>
                    {canStart && (
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 transition-transform duration-250 group-hover/btn:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    )}
                  </span>
                </button>

                <p className="text-[10px] text-muted/70 text-center lg:text-right max-w-xs leading-relaxed">
                  Tip: Mixing difficulties gives you the best chance at a high score.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
