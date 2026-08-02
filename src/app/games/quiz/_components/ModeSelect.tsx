'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGamepad,
  faPlay,
  faTrophy,
  faVolumeUp,
  faVolumeMute,
  faSliders,
  faLayerGroup,
  faBolt,
  faCheck,
  faHeart,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { GameMode, QuestionDifficulty } from '@/types/quiz';
import { CATEGORY_LABELS, type CategoryKey, QUESTIONS_BY_CATEGORY, getAllQuestions } from '@/data/quiz';

interface Props {
  onStart: (mode: GameMode, categories: CategoryKey[], difficulties: QuestionDifficulty[]) => void;
  onOpenLeaderboard: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

const MODES_CONFIG = {
  survival: {
    id: 'survival' as GameMode,
    label: 'Survival',
    tagline: '1 Mistake = Game Over',
    description: 'Answer questions under pressure. 1 wrong choice or timeout ends your streak instantly.',
    icon: faBolt,
  },
  lives: {
    id: 'lives' as GameMode,
    label: '3 Lives',
    tagline: '3 Mistakes Allowed',
    description: 'Start with 3 hearts. Each mistake or timeout costs 1 heart until game ends.',
    icon: faHeart,
  },
  'best-of-100': {
    id: 'best-of-100' as GameMode,
    label: 'Best of 100',
    tagline: '100 Question Marathon',
    description: 'Fixed marathon of 100 questions. Focus on speed and precision to maximize total score.',
    icon: faClock,
  },
} as const;

const MODES_LIST = [MODES_CONFIG.survival, MODES_CONFIG.lives, MODES_CONFIG['best-of-100']];

const DIFFICULTY_CONFIG = {
  easy: {
    id: 'easy' as QuestionDifficulty,
    label: 'Easy',
    pts: '+1',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.14)',
    border: 'rgba(34,197,94,0.35)',
  },
  medium: {
    id: 'medium' as QuestionDifficulty,
    label: 'Medium',
    pts: '+2',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.14)',
    border: 'rgba(234,179,8,0.35)',
  },
  hard: {
    id: 'hard' as QuestionDifficulty,
    label: 'Hard',
    pts: '+3',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.14)',
    border: 'rgba(249,115,22,0.35)',
  },
  'extra-hard': {
    id: 'extra-hard' as QuestionDifficulty,
    label: 'X-Hard',
    pts: '+5',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.14)',
    border: 'rgba(239,68,68,0.35)',
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

export function ModeSelect({ onStart, onOpenLeaderboard, soundEnabled = true, onToggleSound }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('lives');
  const [selectedCats, setSelectedCats] = useState<CategoryKey[]>(ALL_CATEGORIES);
  const [selectedDiffs, setSelectedDiffs] = useState<QuestionDifficulty[]>([
    'easy',
    'medium',
    'hard',
    'extra-hard',
  ]);

  const canStart = selectedCats.length > 0 && selectedDiffs.length > 0;

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

      if (e.key === '1') setSelectedMode('survival');
      if (e.key === '2') setSelectedMode('lives');
      if (e.key === '3') setSelectedMode('best-of-100');
      if (e.key === 'Enter' && canStart) {
        onStart(selectedMode, selectedCats, selectedDiffs);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canStart, selectedMode, selectedCats, selectedDiffs, onStart]);

  const toggleCategory = (cat: CategoryKey) => {
    setSelectedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const toggleDifficulty = (diff: QuestionDifficulty) => {
    setSelectedDiffs((prev) => (prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setSelectedMode(preset.mode);
    setSelectedCats(preset.cats);
    setSelectedDiffs(preset.diffs);
  };

  const selectAllCats = () => setSelectedCats(ALL_CATEGORIES);
  const clearAllCats = () => setSelectedCats([]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-12"
    >
      {/* Main Options Panel */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-[var(--color-border)]/80 bg-[var(--color-surface)]/80 backdrop-blur-xl">
        {/* Glow accent matching Chain Reaction */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Compact Header with inline actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 border-b border-[var(--color-border)]/40 pb-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-11 h-11 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-2xl flex items-center justify-center border border-[var(--color-accent)]/20 shrink-0">
              <FontAwesomeIcon icon={faGamepad} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                Developer <span className="text-[var(--color-accent)]">Quiz</span>
              </h1>
              <p className="text-[var(--color-muted)] text-xs">
                Test your CS & full-stack development skills
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="py-2 px-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-foreground)] font-bold text-xs bg-[var(--color-surface)]/50 transition-all cursor-pointer flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTrophy} className="text-amber-400" />
              Leaderboard
            </button>

            {onToggleSound && (
              <button
                type="button"
                onClick={onToggleSound}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                className="py-2 px-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] font-bold text-xs bg-[var(--color-surface)]/50 transition-all cursor-pointer flex items-center justify-center"
              >
                <FontAwesomeIcon
                  icon={soundEnabled ? faVolumeUp : faVolumeMute}
                  className={soundEnabled ? 'text-[var(--color-accent)]' : ''}
                />
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Modes & Presets */}
          <div className="lg:col-span-5 space-y-4">
            {/* Game Mode Tab Selector */}
            <div>
              <label className="text-xs font-extrabold text-[var(--color-foreground)]/80 uppercase tracking-wider block mb-2">
                Game Mode
              </label>
              <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)]/80 rounded-2xl p-1">
                {MODES_LIST.map((m) => {
                  const isSelected = selectedMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMode(m.id)}
                      className={`flex-1 py-2.5 px-1.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20'
                          : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                      }`}
                    >
                      <FontAwesomeIcon icon={m.icon} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Mode Description Banner */}
            <div className="p-3.5 rounded-2xl bg-[var(--color-surface)]/60 border border-[var(--color-border)]/50">
              <div className="text-[11px] uppercase font-extrabold text-[var(--color-accent)] tracking-wider mb-1">
                {MODES_CONFIG[selectedMode].tagline}
              </div>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                {MODES_CONFIG[selectedMode].description}
              </p>
            </div>

            {/* Quick Presets Sub-panel */}
            <div className="bg-[var(--color-surface)]/40 rounded-2xl p-3.5 border border-[var(--color-border)]/40">
              <label className="text-xs font-extrabold text-[var(--color-foreground)]/80 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <FontAwesomeIcon icon={faBolt} className="text-[var(--color-accent)]" />
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => {
                  const isMatch =
                    selectedMode === preset.mode &&
                    preset.cats.length === selectedCats.length &&
                    preset.cats.every((c) => selectedCats.includes(c)) &&
                    preset.diffs.length === selectedDiffs.length &&
                    preset.diffs.every((d) => selectedDiffs.includes(d));

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`py-2 px-2 rounded-xl border font-bold text-xs transition-all duration-200 cursor-pointer truncate ${
                        isMatch
                          ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/40 shadow-xs'
                          : 'bg-[var(--color-surface)]/50 text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-foreground)]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Categories & Difficulty */}
          <div className="lg:col-span-7 space-y-4">
            {/* Categories Sub-panel */}
            <div className="bg-[var(--color-surface)]/40 rounded-2xl p-4 border border-[var(--color-border)]/40">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-extrabold text-[var(--color-foreground)]/80 uppercase tracking-wider flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-[var(--color-accent)]" />
                  Categories ({selectedCats.length}/{ALL_CATEGORIES.length})
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllCats}
                    className="text-xs font-bold text-[var(--color-accent)] hover:underline cursor-pointer"
                  >
                    All
                  </button>
                  <span className="text-[var(--color-muted)] text-xs">|</span>
                  <button
                    type="button"
                    onClick={clearAllCats}
                    className="text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-foreground)] cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const isSelected = selectedCats.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`py-2 px-2.5 rounded-xl border font-bold text-xs flex items-center justify-between gap-1.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--color-accent)]/15 text-[var(--color-foreground)] border-[var(--color-accent)]/40 shadow-xs'
                          : 'bg-[var(--color-surface)]/40 text-[var(--color-muted)]/60 border-[var(--color-border)]/40 hover:border-[var(--color-border)] hover:text-[var(--color-muted)]'
                      }`}
                    >
                      <span className="truncate">{CATEGORY_LABELS[cat]}</span>
                      {isSelected && (
                        <FontAwesomeIcon icon={faCheck} className="text-[var(--color-accent)] text-xs shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Sub-panel with difficulty colors */}
            <div className="bg-[var(--color-surface)]/40 rounded-2xl p-4 border border-[var(--color-border)]/40">
              <label className="text-xs font-extrabold text-[var(--color-foreground)]/80 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <FontAwesomeIcon icon={faSliders} className="text-[var(--color-accent)]" />
                Difficulty Levels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIFFICULTY_LIST.map((diff) => {
                  const isSelected = selectedDiffs.includes(diff.id);
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => toggleDifficulty(diff.id)}
                      className="py-2 px-2.5 rounded-xl border font-bold text-xs flex items-center justify-between transition-all duration-200 cursor-pointer"
                      style={{
                        color: isSelected ? diff.color : 'var(--color-muted)',
                        backgroundColor: isSelected ? diff.bg : 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
                        borderColor: isSelected ? diff.border : 'color-mix(in srgb, var(--color-border) 40%, transparent)',
                      }}
                    >
                      <span>{diff.label}</span>
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: diff.color }}
                      >
                        {diff.pts}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separate Standalone Start Quiz Action Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-4"
      >
        <button
          type="button"
          disabled={!canStart}
          onClick={() => canStart && onStart(selectedMode, selectedCats, selectedDiffs)}
          className={`w-full py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-3 text-base sm:text-lg transition-all cursor-pointer shadow-2xl ${
            canStart
              ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-lg shadow-[var(--color-accent)]/25 hover:scale-[1.01]'
              : 'bg-[var(--color-surface)]/80 border border-[var(--color-border)] text-[var(--color-muted)] cursor-not-allowed opacity-50'
          }`}
        >
          <FontAwesomeIcon icon={faPlay} className="text-lg" />
          <span>Start Quiz ({totalMatchingQuestions} Questions)</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
