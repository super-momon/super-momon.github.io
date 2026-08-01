'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { GameMode, QuestionDifficulty } from '@/types/quiz';
import { CATEGORY_LABELS, type CategoryKey, QUESTIONS_BY_CATEGORY, getAllQuestions } from '@/data/quiz';

interface Props {
  onStart: (mode: GameMode, categories: CategoryKey[], difficulties: QuestionDifficulty[]) => void;
  onOpenLeaderboard: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

// ─── Visual Configuration ──────────────────────────────────────────────────

const MODES_CONFIG = {
  survival: {
    id: 'survival' as GameMode,
    label: 'Survival',
    tagline: '1 Wrong = Sudden Death',
    description: 'Answer correctly without stopping. Timeout or 1 mistake ends your run instantly.',
    hotkey: '1',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  lives: {
    id: 'lives' as GameMode,
    label: '3 Lives',
    tagline: '3 Mistakes Allowed',
    description: 'Start with 3 hearts. Each mistake or timeout costs a life until run ends.',
    hotkey: '2',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  'best-of-100': {
    id: 'best-of-100' as GameMode,
    label: 'Best of 100',
    tagline: '100 Questions Marathon',
    description: 'Fixed marathon of 100 questions. No sudden death — chase maximum high score.',
    hotkey: '3',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
    bars: 1,
  },
  medium: {
    id: 'medium' as QuestionDifficulty,
    label: 'Medium',
    pts: '+2',
    bars: 2,
  },
  hard: {
    id: 'hard' as QuestionDifficulty,
    label: 'Hard',
    pts: '+3',
    bars: 3,
  },
  'extra-hard': {
    id: 'extra-hard' as QuestionDifficulty,
    label: 'X-Hard',
    pts: '+5',
    bars: 4,
  },
} as const;

const DIFFICULTY_LIST = [
  DIFFICULTY_CONFIG.easy,
  DIFFICULTY_CONFIG.medium,
  DIFFICULTY_CONFIG.hard,
  DIFFICULTY_CONFIG['extra-hard'],
];

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as CategoryKey[];

const PRESETS = [
  {
    id: 'all',
    label: '⚡ Full Marathon',
    mode: 'best-of-100' as GameMode,
    cats: ALL_CATEGORIES,
    diffs: ['easy', 'medium', 'hard', 'extra-hard'] as QuestionDifficulty[],
  },
  {
    id: 'frontend',
    label: '💻 Frontend',
    mode: 'lives' as GameMode,
    cats: ['javascript', 'typescript', 'react', 'css-html', 'ui-ux'] as CategoryKey[],
    diffs: ['easy', 'medium', 'hard', 'extra-hard'] as QuestionDifficulty[],
  },
  {
    id: 'backend',
    label: '⚙️ Backend & DBs',
    mode: 'lives' as GameMode,
    cats: ['python', 'data-structures', 'databases', 'git', 'general-cs', 'dotnet', 'aws'] as CategoryKey[],
    diffs: ['easy', 'medium', 'hard', 'extra-hard'] as QuestionDifficulty[],
  },
  {
    id: 'sprint',
    label: '🚀 Quick Sprint',
    mode: 'lives' as GameMode,
    cats: ['javascript', 'react', 'css-html'] as CategoryKey[],
    diffs: ['easy', 'medium'] as QuestionDifficulty[],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

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

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center justify-center w-5 h-5 rounded-md text-xs font-bold font-mono bg-accent/15 border border-accent/30 text-accent shrink-0">
        {number}
      </span>
      <h2 className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-foreground">
        {title}
      </h2>
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
    <div className="flex items-center shrink-0 p-0.5 rounded-lg border border-border/70 bg-surface/60 backdrop-blur-md">
      <button
        type="button"
        onClick={onAll}
        className={[
          'relative px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-accent',
          isAll ? 'text-background' : 'text-muted hover:text-foreground',
        ].join(' ')}
      >
        {isAll && (
          <motion.span
            layoutId={`filter-toggle-pill-${groupId}`}
            className="absolute inset-0 rounded-md bg-accent"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{allLabel}</span>
      </button>
      <button
        type="button"
        onClick={onNone}
        className={[
          'relative px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-accent',
          !isAll ? 'text-background' : 'text-muted hover:text-foreground',
        ].join(' ')}
      >
        {!isAll && (
          <motion.span
            layoutId={`filter-toggle-pill-${groupId}`}
            className="absolute inset-0 rounded-md bg-accent"
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function ModeSelect({ onStart, onOpenLeaderboard, soundEnabled = true, onToggleSound }: Props) {
  const [selected, setSelected] = useState<GameMode | null>('lives');
  const [selectedCats, setSelectedCats] = useState<CategoryKey[]>(ALL_CATEGORIES);
  const [selectedDiffs, setSelectedDiffs] = useState<QuestionDifficulty[]>(['easy', 'medium', 'hard', 'extra-hard']);
  const ctaRef = useMagneticButton<HTMLButtonElement>(0.15);
  const prefersReducedMotion = useReducedMotion();

  // Scroll sentinel for conditional floating action bar
  const inlineActionBarRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const sentinel = inlineActionBarRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFloating(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const canStart = selected !== null && selectedCats.length > 0 && selectedDiffs.length > 0;

  const totalMatchingQuestions = useMemo(() => {
    let pool: { difficulty: QuestionDifficulty }[] = [];
    if (selectedCats.length > 0) {
      selectedCats.forEach((cat) => {
        if (QUESTIONS_BY_CATEGORY[cat]) {
          pool.push(...(QUESTIONS_BY_CATEGORY[cat] as { difficulty: QuestionDifficulty }[]));
        }
      });
    } else {
      pool = getAllQuestions() as { difficulty: QuestionDifficulty }[];
    }
    if (selectedDiffs.length > 0) {
      pool = pool.filter((q) => selectedDiffs.includes(q.difficulty));
    }
    return pool.length;
  }, [selectedCats, selectedDiffs]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1') setSelected('survival');
      if (e.key === '2') setSelected('lives');
      if (e.key === '3') setSelected('best-of-100');
      if (e.key === 'Enter' && canStart && selected) {
        onStart(selected, selectedCats, selectedDiffs);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canStart, selected, selectedCats, selectedDiffs, onStart]);

  const toggleCategory = (cat: CategoryKey) => {
    setSelectedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const toggleDifficulty = (diff: QuestionDifficulty) => {
    setSelectedDiffs((prev) => (prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setSelected(preset.mode);
    setSelectedCats(preset.cats);
    setSelectedDiffs(preset.diffs);
  };

  const renderActionBarContent = (isSticky = false) => (
    <div
      className={[
        'rounded-2xl p-3 md:px-5 md:py-3 border bg-surface/90 backdrop-blur-xl flex items-center justify-between gap-3 w-full transition-all duration-200',
        isSticky ? 'border-accent/40 shadow-2xl' : 'border-border/80 shadow-lg',
      ].join(' ')}
    >
      {/* Summary stats */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent text-xs font-bold font-mono">
          <span>⚡</span>
          <span>{totalMatchingQuestions} Questions</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted font-mono">
          <span className="px-2 py-0.5 rounded-md border border-border bg-surface">
            Mode: <strong className="text-foreground uppercase">{selected || 'None'}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md border border-border bg-surface">
            Topics: <strong className="text-foreground">{selectedCats.length}/12</strong>
          </span>
        </div>
      </div>

      {/* Action button */}
      <button
        ref={isSticky ? ctaRef : undefined}
        disabled={!canStart}
        onClick={() => canStart && selected && onStart(selected, selectedCats, selectedDiffs)}
        className={[
          'group/btn relative px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider overflow-hidden transition-all duration-200 outline-hidden cursor-pointer flex items-center justify-center gap-2 shadow-md shrink-0',
          canStart
            ? 'bg-accent text-background shadow-[0_6px_24px_rgba(8,202,95,0.35)] hover:shadow-[0_8px_30px_rgba(8,202,95,0.5)]'
            : 'bg-surface border border-border text-muted cursor-not-allowed opacity-60',
        ].join(' ')}
      >
        {canStart && (
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-20 animate-pulse bg-white"
          />
        )}
        <span className="relative flex items-center gap-2">
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
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          )}
        </span>

        {canStart && (
          <span className="relative text-xs font-mono opacity-80 border border-background/30 px-1.5 py-0.2 rounded-md hidden md:inline-block">
            [↵ Enter]
          </span>
        )}
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-12 pb-16 px-4 select-none">
      <AmbientBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center gap-4 my-auto"
      >
        {/* Centered Header */}
        <motion.div variants={item} className="flex flex-col items-center text-center justify-center gap-2 pb-1">
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--color-accent)]" />
            <h1 className="font-extrabold tracking-tight text-foreground text-2xl md:text-3xl">
              Developer Skill Quiz
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md border border-accent/30 bg-accent/10 text-accent font-bold">
              SETUP
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-1">
            <motion.button
              onClick={onOpenLeaderboard}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="group flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border border-border bg-surface/80 hover:border-accent/40 text-muted hover:text-foreground transition-all duration-200 backdrop-blur-md"
            >
              <svg className="w-3.5 h-3.5 text-muted group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              Leaderboard
            </motion.button>

            {onToggleSound && (
              <motion.button
                onClick={onToggleSound}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                aria-label={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                className="flex items-center justify-center p-1.5 rounded-xl border border-border bg-surface/80 hover:border-accent/40 text-muted hover:text-foreground transition-all duration-200 backdrop-blur-md cursor-pointer"
              >
                {soundEnabled ? (
                  <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.287a5 5 0 010 7.426M11 5L6 9H2v6h4l5 4V5z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-muted/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* 2-Column Balanced & Centered Setup Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch w-full">
          {/* Left Column: Step 1 Game Modes & Quick Presets */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Step 1: Mode Selection */}
            <motion.div
              variants={item}
              className="rounded-2xl p-4 md:p-5 border border-border/80 bg-surface/80 backdrop-blur-xl shadow-lg flex flex-col justify-between gap-3 h-full"
            >
              <div className="flex items-center justify-center w-full">
                <SectionHeading number="1" title="Select Game Mode" />
              </div>

              <div className="flex flex-col gap-2.5">
                {MODES_LIST.map((m) => {
                  const isSelected = selected === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      type="button"
                      onClick={() => setSelected(m.id)}
                      whileHover={prefersReducedMotion ? undefined : { y: -1, transition: { duration: 0.15 } }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                      className={[
                        'group relative w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-between gap-3',
                        isSelected
                          ? 'border-accent/60 bg-accent/10 shadow-[0_4px_20px_rgba(8,202,95,0.12)]'
                          : 'border-border/70 bg-surface/40 hover:border-slate-500 hover:bg-surface/70',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={[
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 border',
                            isSelected
                              ? 'bg-accent/15 border-accent/40 text-accent'
                              : 'bg-surface border-border/80 text-muted group-hover:text-foreground group-hover:border-slate-500',
                          ].join(' ')}
                        >
                          {m.icon}
                        </div>

                        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground">{m.label}</span>
                            <span
                              className={[
                                'text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0',
                                isSelected
                                  ? 'bg-accent/20 border-accent/30 text-accent'
                                  : 'bg-surface/80 border-border text-muted',
                              ].join(' ')}
                            >
                              {m.tagline}
                            </span>
                          </div>
                          <p className="text-xs text-muted leading-relaxed line-clamp-2">{m.description}</p>
                        </div>
                      </div>

                      {/* Right column fixed slot (prevents layout shift) */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-muted/60 px-2 py-0.5 rounded-md border border-border bg-surface/50">
                          [{m.hotkey}]
                        </span>
                        <div className="w-5 h-5 relative flex items-center justify-center shrink-0">
                          <AnimatePresence mode="wait">
                            {isSelected && (
                              <motion.span
                                key="selected-badge"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute inset-0 rounded-full flex items-center justify-center bg-accent text-background shadow-xs"
                              >
                                <svg className="w-3 h-3 text-background" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Presets Bar */}
            <motion.div
              variants={item}
              className="rounded-2xl p-4 border border-border/80 bg-surface/80 backdrop-blur-xl shadow-lg flex flex-col items-center gap-2.5"
            >
              <div className="flex items-center justify-center w-full">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
                  ⚡ Quick Setup Presets
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {PRESETS.map((preset) => {
                  const isMatch =
                    selected === preset.mode &&
                    preset.cats.length === selectedCats.length &&
                    preset.cats.every((c) => selectedCats.includes(c)) &&
                    preset.diffs.length === selectedDiffs.length &&
                    preset.diffs.every((d) => selectedDiffs.includes(d));

                  return (
                    <motion.button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                      className={[
                        'px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer text-center truncate outline-hidden focus-visible:ring-2 focus-visible:ring-accent',
                        isMatch
                          ? 'border-accent/80 bg-accent/15 text-accent shadow-[0_0_14px_rgba(8,202,95,0.25)]'
                          : 'border-border/70 bg-surface/50 text-muted hover:text-foreground hover:border-accent/40',
                      ].join(' ')}
                    >
                      <span className="truncate">{preset.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Steps 2 & 3 */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {/* Step 2: Categories */}
            <motion.div
              variants={item}
              className="rounded-2xl p-4 md:p-5 border border-border/80 bg-surface/80 backdrop-blur-xl shadow-lg flex flex-col gap-3"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <SectionHeading number="2" title="Filter Categories" />
                <FilterToggle
                  allLabel="All 12"
                  noneLabel="Clear"
                  isAll={selectedCats.length === ALL_CATEGORIES.length}
                  onAll={() => setSelectedCats(ALL_CATEGORIES)}
                  onNone={() => setSelectedCats([])}
                  groupId="categories"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const active = selectedCats.includes(cat);
                  return (
                    <motion.button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                      className={[
                        'relative px-3 py-2.5 rounded-xl text-xs cursor-pointer border transition-all duration-200 outline-hidden flex items-center justify-between gap-2',
                        active
                          ? 'border-accent/60 bg-accent/10 text-foreground font-bold shadow-xs'
                          : 'border-border/70 text-muted hover:border-slate-500 hover:text-foreground bg-surface/40',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-2 truncate min-w-0 flex-1">
                        <span
                          className={[
                            'w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300',
                            active ? 'bg-accent shadow-[0_0_6px_var(--color-accent)]' : 'bg-muted/40',
                          ].join(' ')}
                        />
                        <span className="truncate">{CATEGORY_LABELS[cat]}</span>
                      </span>

                      {/* Fixed indicator slot (prevents layout shift) */}
                      <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {active && (
                            <motion.svg
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="w-3.5 h-3.5 text-accent"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 3: Difficulties */}
            <motion.div
              variants={item}
              className="rounded-2xl p-4 md:p-5 border border-border/80 bg-surface/80 backdrop-blur-xl shadow-lg flex flex-col gap-3"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <SectionHeading number="3" title="Filter Difficulties" />
                <FilterToggle
                  allLabel="All 4"
                  noneLabel="Clear"
                  isAll={selectedDiffs.length === DIFFICULTY_LIST.length}
                  onAll={() => setSelectedDiffs(['easy', 'medium', 'hard', 'extra-hard'])}
                  onNone={() => setSelectedDiffs([])}
                  groupId="difficulties"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIFFICULTY_LIST.map(({ id, label, pts, bars }) => {
                  const active = selectedDiffs.includes(id);
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => toggleDifficulty(id)}
                      whileHover={prefersReducedMotion ? undefined : { y: -1, transition: { duration: 0.15 } }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                      className={[
                        'group/diff relative p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 outline-hidden overflow-hidden gap-2',
                        active
                          ? 'border-accent/60 bg-accent/10 text-foreground font-bold shadow-xs'
                          : 'border-border/70 text-muted hover:border-slate-500 bg-surface/40',
                      ].join(' ')}
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className={`text-xs font-bold tracking-wider uppercase truncate ${active ? 'text-foreground' : 'text-muted'}`}>
                          {label}
                        </span>
                        <div className="flex gap-0.5 items-end h-2">
                          {[1, 2, 3, 4].map((i) => {
                            const filled = i <= bars;
                            return (
                              <span
                                key={i}
                                className="w-1 rounded-full transition-all duration-300"
                                style={{
                                  height: `${i * 25}%`,
                                  background: filled ? (active ? 'var(--color-accent)' : 'var(--color-muted)') : 'var(--color-border)',
                                  opacity: filled ? (active ? 1 : 0.4) : 0.2,
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      <span
                        className={[
                          'px-2 py-0.5 rounded-md text-xs font-mono font-bold tracking-wide transition-all duration-200 shrink-0 border',
                          active
                            ? 'bg-accent text-background border-accent'
                            : 'bg-surface border-border/80 text-muted',
                        ].join(' ')}
                      >
                        {pts}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Inline Action Bar (Standard Resting State) */}
        <motion.div variants={item} className="w-full mt-1" ref={inlineActionBarRef}>
          {renderActionBarContent(false)}
        </motion.div>
      </motion.div>

      {/* Conditional Floating Bottom Action Bar (Only visible when scrolled beyond inline bar) */}
      <AnimatePresence>
        {isFloating && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed bottom-3 left-3 right-3 z-40 max-w-4xl mx-auto"
          >
            {renderActionBarContent(true)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


