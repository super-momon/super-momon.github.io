'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { GameMode, QuestionDifficulty } from '@/types/quiz';
import { CATEGORY_LABELS, type CategoryKey } from '@/data/quiz';

interface Props {
  onStart: (mode: GameMode, categories: CategoryKey[], difficulties: QuestionDifficulty[]) => void;
  onOpenLeaderboard: () => void;
}

// Config for Game Modes with premium SVG icons, accents, and custom gradients
const MODES_CONFIG = {
  survival: {
    id: 'survival' as GameMode,
    label: 'Survival',
    tagline: 'One strike and it’s over',
    description:
      'Answer correctly without stopping. A single wrong answer — or a timeout — ends your run. Only the sharpest survive.',
    color: 'rgb(249,115,22)', // orange-500
    glowColor: 'rgba(249,115,22,0.15)',
    activeBorder: 'border-orange-500/60 dark:border-orange-500/40',
    accentClass: 'text-orange-600 dark:text-orange-400',
    bg: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.01) 100%)',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  lives: {
    id: 'lives' as GameMode,
    label: '3 Lives',
    tagline: 'Three strikes before the end',
    description:
      'You have three lives. Each wrong answer or timeout costs one. When all three are gone, the run ends.',
    color: 'rgb(59,130,246)', // blue-500
    glowColor: 'rgba(59,130,246,0.15)',
    activeBorder: 'border-blue-500/60 dark:border-blue-500/40',
    accentClass: 'text-blue-600 dark:text-blue-400',
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.01) 100%)',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  'best-of-100': {
    id: 'best-of-100' as GameMode,
    label: 'Best of 100',
    tagline: 'Score as high as you can',
    description:
      'A fixed set of 100 questions — no sudden death, no lives. Answer every question and see how high you can score.',
    color: 'rgb(168,85,247)', // purple-500
    glowColor: 'rgba(168,85,247,0.15)',
    activeBorder: 'border-purple-500/60 dark:border-purple-500/40',
    accentClass: 'text-purple-600 dark:text-purple-400',
    bg: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(168,85,247,0.01) 100%)',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
} as const;

const MODES_LIST = [
  MODES_CONFIG['survival'],
  MODES_CONFIG['lives'],
  MODES_CONFIG['best-of-100'],
];

const SCORING = [
  { id: 'easy' as QuestionDifficulty, label: 'Easy', pts: '+1', color: 'text-green-600 dark:text-green-400' },
  { id: 'medium' as QuestionDifficulty, label: 'Medium', pts: '+2', color: 'text-amber-500 dark:text-amber-400' },
  { id: 'hard' as QuestionDifficulty, label: 'Hard', pts: '+3', color: 'text-orange-600 dark:text-orange-400' },
  { id: 'extra-hard' as QuestionDifficulty, label: 'X-Hard', pts: '+5', color: 'text-red-600 dark:text-red-400' },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function ModeSelect({ onStart, onOpenLeaderboard }: Props) {
  const [selected, setSelected] = useState<GameMode | null>(null);
  const [selectedCats, setSelectedCats] = useState<CategoryKey[]>(Object.keys(CATEGORY_LABELS) as CategoryKey[]);
  const [selectedDiffs, setSelectedDiffs] = useState<QuestionDifficulty[]>(['easy', 'medium', 'hard', 'extra-hard']);

  const canStart = selected && selectedCats.length > 0 && selectedDiffs.length > 0;

  // Helper to render difficulty signal bars (visual progress indicator)
  function renderDifficultySignal(id: QuestionDifficulty, active: boolean, activeColorClass: string) {
    const barsCount = id === 'easy' ? 1 : id === 'medium' ? 2 : id === 'hard' ? 3 : 4;
    return (
      <div className={`flex gap-0.5 items-end h-2.5 mb-1.5 opacity-80 ${active ? activeColorClass : 'text-slate-400 dark:text-slate-600'}`}>
        {[1, 2, 3, 4].map((i) => {
          const isFilled = i <= barsCount;
          return (
            <span
              key={i}
              className="w-[3px] rounded-full transition-all duration-300"
              style={{
                height: `${i * 25}%`,
                background: isFilled
                  ? 'currentColor'
                  : 'color-mix(in srgb, var(--color-border) 35%, transparent)',
              }}
            />
          );
        })}
      </div>
    );
  }

  // Step heading component for cleaner visuals and structural modularity
  function StepHeading({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
    return (
      <div className="flex flex-col mb-4 w-full">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            {number}
          </span>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 pl-7">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 lg:py-14 select-none">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl flex flex-col items-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-start">
          {/* Left Column: Title, Leaderboard Button, and Game Modes */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            {/* Eyebrow + Title */}
            <motion.div variants={item} className="text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-semibold mb-6"
                style={{
                  borderColor: 'rgba(0,199,88,0.22)',
                  background: 'rgba(0,199,88,0.06)',
                  color: 'var(--color-muted)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                  style={{ background: 'var(--color-accent)', boxShadow: '0 0 8px rgba(0,199,88,0.9)' }}
                />
                Programming Quiz
              </div>
              <h1
                className="font-extrabold tracking-tight text-foreground mb-3 leading-tight text-balance"
                style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}
              >
                Choose your <span style={{ color: 'var(--color-accent)' }}>challenge</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto lg:mx-0 leading-relaxed">
                Customize parameters or jump straight into the endless questions.
              </p>
            </motion.div>

            {/* Secondary Action: Leaderboard Trigger */}
            <motion.div variants={item} className="w-full flex justify-center lg:justify-start">
              <motion.button
                onClick={onOpenLeaderboard}
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted)',
                  background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = 'color-mix(in srgb, var(--color-accent) 30%, var(--color-border))';
                  btn.style.color = 'var(--color-foreground)';
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = 'var(--color-border)';
                  btn.style.color = 'var(--color-muted)';
                }}
              >
                <svg aria-hidden="true" className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Leaderboard
              </motion.button>
            </motion.div>

            {/* Step 1: Mode Selection */}
            <motion.div variants={item} className="w-full">
              <StepHeading
                number="1"
                title="Select Game Mode"
                subtitle="Choose a challenge format that suits your style."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full mt-2">
                {MODES_LIST.map((m) => {
                  const isSelected = selected === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      whileHover={{ y: -1, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelected(m.id)}
                      className={[
                        'group relative p-4 rounded-xl border text-left cursor-pointer overflow-hidden transition-[border-color,background-color,box-shadow] duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        isSelected
                          ? `${m.activeBorder} shadow-sm`
                          : 'border-border bg-surface/40 hover:border-slate-350 dark:hover:border-slate-700 shadow-2xs',
                      ].join(' ')}
                      style={{
                        background: isSelected ? m.bg : 'var(--color-surface)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        boxShadow: isSelected ? `0 8px 30px ${m.glowColor}` : undefined,
                      }}
                    >
                      {/* Selected checkmark indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--color-accent)' }}
                          >
                            <svg aria-hidden="true" className="w-3 h-3" style={{ color: 'var(--color-background)' }} viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-row sm:flex-col lg:flex-row gap-4 items-start pr-6 sm:pr-0 lg:pr-6">
                        {/* Icon Container */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                          style={{
                            background: isSelected ? 'var(--color-background)' : 'rgba(100, 116, 139, 0.06)',
                            border: isSelected ? `1px solid ${m.color}` : '1px solid var(--color-border)',
                            color: isSelected ? m.color : 'var(--color-muted)',
                            boxShadow: isSelected ? `0 0 12px ${m.glowColor}` : undefined,
                          }}
                        >
                          {m.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col xl:flex-row xl:items-baseline gap-0.5 xl:gap-2 mb-1">
                            <span className="font-bold text-sm text-foreground group-hover:text-foreground/90 transition-colors duration-200">
                              {m.label}
                            </span>
                            <span className={`text-[9px] font-semibold tracking-wide uppercase shrink-0 ${m.accentClass}`}>
                              {m.tagline}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Customizations (Steps 2 & 3) and CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            {/* Step 2: Customizations - Categories */}
            <div
              className="w-full rounded-2xl border p-6"
              style={{
                background: 'var(--color-surface)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'var(--color-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.01)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <StepHeading
                  number="2"
                  title="Filter Categories"
                  subtitle="Include or exclude topics as you prefer."
                />

                <div className="flex items-center gap-2 shrink-0 self-start mt-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCats(Object.keys(CATEGORY_LABELS) as CategoryKey[])}
                    className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors outline-hidden focus-visible:ring-1 focus-visible:ring-slate-400"
                  >
                    All
                  </button>
                  <span className="text-[10px] text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCats([])}
                    className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350 cursor-pointer transition-colors outline-hidden focus-visible:ring-1 focus-visible:ring-slate-400"
                  >
                    None
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 mt-2">
                {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((cat) => {
                  const active = selectedCats.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        if (active) {
                          setSelectedCats(selectedCats.filter((c) => c !== cat));
                        } else {
                          setSelectedCats([...selectedCats, cat]);
                        }
                      }}
                      className={[
                        'relative px-6 py-2 rounded-xl text-[11px] font-semibold cursor-pointer border text-center transition-all duration-200 hover:-translate-y-[1px] outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        active
                          ? 'border-slate-400 dark:border-slate-600 text-foreground font-bold shadow-2xs'
                          : 'border-border/60 text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200 bg-surface/30 hover:bg-surface/80 dark:bg-surface/20 dark:hover:bg-surface/60',
                      ].join(' ')}
                      style={{
                        background: active ? 'color-mix(in srgb, var(--color-foreground) 4%, var(--color-surface))' : undefined,
                      }}
                    >
                      {active && (
                        <svg aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground/80 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      <span className="block text-center">{CATEGORY_LABELS[cat]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Customizations - Difficulty */}
            <div
              className="w-full rounded-2xl border p-6 mb-4"
              style={{
                background: 'var(--color-surface)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'var(--color-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.01)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <StepHeading
                  number="3"
                  title="Filter Difficulties & Scoring"
                  subtitle="Configure the difficulty tier pool and point multipliers."
                />

                <div className="flex items-center gap-2 shrink-0 self-start mt-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDiffs(['easy', 'medium', 'hard', 'extra-hard'])}
                    className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors outline-hidden focus-visible:ring-1 focus-visible:ring-slate-400"
                  >
                    All
                  </button>
                  <span className="text-[10px] text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDiffs([])}
                    className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-350 cursor-pointer transition-colors outline-hidden focus-visible:ring-1 focus-visible:ring-slate-400"
                  >
                    None
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {SCORING.map(({ id, label, pts, color }) => {
                  const active = selectedDiffs.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        if (active) {
                          setSelectedDiffs(selectedDiffs.filter((d) => d !== id));
                        } else {
                          setSelectedDiffs([...selectedDiffs, id]);
                        }
                      }}
                      className={[
                        'group/diff relative p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-[1px] outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        active
                          ? 'border-slate-400 dark:border-slate-600 text-foreground font-black shadow-2xs'
                          : 'border-border/60 text-slate-500 hover:border-slate-300 dark:text-slate-400 dark:hover:border-slate-700 bg-surface/30 hover:bg-surface/80 dark:bg-surface/20 dark:hover:bg-surface/60',
                      ].join(' ')}
                      style={{
                        background: active ? 'color-mix(in srgb, var(--color-foreground) 4%, var(--color-surface))' : undefined,
                      }}
                    >
                      {/* Points Indicator Badge */}
                      <div
                        className={[
                          'absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[8px] font-extrabold tracking-wide transition-all duration-200',
                          active
                            ? 'bg-foreground/5 text-foreground'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
                        ].join(' ')}
                      >
                        {pts} PTS
                      </div>

                      <div className="flex flex-col items-center pt-2.5">
                        {/* Signal Level Graphic */}
                        {renderDifficultySignal(id, active, color)}

                        <span className={`text-[11px] font-extrabold tracking-wide uppercase ${active ? 'text-foreground font-black' : 'text-slate-500/80'}`}>
                          {label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA & Actions */}
            <motion.div variants={item} className="flex flex-col items-center lg:items-end gap-3.5 mt-2">
              <motion.button
                disabled={!canStart}
                onClick={() => canStart && onStart(selected, selectedCats, selectedDiffs)}
                whileHover={canStart ? { scale: 1.02, y: -1 } : undefined}
                whileTap={canStart ? { scale: 0.98 } : undefined}
                className={[
                  'group/btn relative px-16 py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  canStart
                    ? 'cursor-pointer'
                    : 'bg-surface border border-border text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-40',
                ].join(' ')}
                style={
                  canStart
                    ? {
                      background: 'var(--color-accent)',
                      color: 'var(--color-background)',
                      boxShadow: '0 8px 30px rgba(0, 199, 88, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    }
                    : undefined
                }
              >
                {/* Glossy gradient animate shimmer */}
                {canStart && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2.4s ease-in-out infinite',
                    }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  <span>
                    {!selected
                      ? 'Select a Mode'
                      : selectedCats.length === 0
                        ? 'Choose Category'
                        : selectedDiffs.length === 0
                          ? 'Choose Difficulty'
                          : 'Begin Run'}
                  </span>
                  {canStart && (
                    <svg aria-hidden="true" className="w-4 h-4 transition-transform duration-250 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
