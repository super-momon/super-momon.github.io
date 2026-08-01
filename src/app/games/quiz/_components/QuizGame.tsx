'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { QuizQuestion, GameMode, AnswerState } from '@/types/quiz';
import { QuestionCard } from './QuestionCard';

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  score: number;
  lives: number;
  maxLives: number;
  streak?: number;
  mode: GameMode;
  answerState: AnswerState;
  selectedAnswer: number | null;
  timeLeft: number;
  totalSeconds: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onAnswer: (index: number) => void;
  onForfeit?: () => void;
  onSkipFeedback?: () => void;
}

export function QuizGame({
  question,
  questionNumber,
  score,
  lives,
  maxLives,
  streak = 0,
  mode,
  answerState,
  selectedAnswer,
  timeLeft,
  totalSeconds,
  soundEnabled = true,
  onToggleSound,
  onAnswer,
  onForfeit,
  onSkipFeedback,
}: Props) {
  const [confirmForfeit, setConfirmForfeit] = useState(false);
  const timerPercent = Math.max(0, (timeLeft / totalSeconds) * 100);
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && timeLeft > 5;

  const timerColor = isUrgent
    ? '#ef4444'
    : isWarning
      ? '#f59e0b'
      : 'var(--color-accent)';

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events inside inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (answerState !== 'unanswered') {
        if ((e.key === ' ' || e.key === 'Enter') && onSkipFeedback) {
          e.preventDefault();
          onSkipFeedback();
        }
        return;
      }

      // Key 1-4 or A-D
      let optionIndex: number | null = null;
      if (['1', 'a', 'A'].includes(e.key)) optionIndex = 0;
      else if (['2', 'b', 'B'].includes(e.key)) optionIndex = 1;
      else if (['3', 'c', 'C'].includes(e.key)) optionIndex = 2;
      else if (['4', 'd', 'D'].includes(e.key)) optionIndex = 3;

      if (optionIndex !== null && optionIndex < question.options.length) {
        e.preventDefault();
        onAnswer(optionIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerState, question.options.length, onAnswer, onSkipFeedback]);

  return (
    <div className="min-h-screen flex flex-col items-center pt-28 sm:pt-32 md:pt-36 pb-20 px-4 sm:px-6">
      {/* Header bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl mb-4"
      >
        <div className="relative bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 rounded-3xl p-4 md:px-6 md:py-4 flex items-center justify-between mb-4 shadow-lg shadow-black/5 dark:shadow-black/30 overflow-hidden">
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent pointer-events-none rounded-3xl" />

          <div className="relative z-10 flex items-center justify-between w-full flex-wrap gap-2">
            {/* Score & Streak */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted">
                  Score
                </span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={score}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-2xl font-bold tabular-nums text-accent"
                    style={{ textShadow: '0 0 16px rgba(0,199,88,0.45)' }}
                  >
                    {score}
                  </motion.span>
                </AnimatePresence>
              </div>

              {streak >= 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/15 border border-amber-500/30 text-amber-500 shadow-xs"
                >
                  <motion.span
                    animate={{ y: [0, -2, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🔥
                  </motion.span>
                  <span>{streak} Streak</span>
                </motion.div>
              )}
            </div>

            {/* Question number */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-muted">
                Question
              </span>
              <span className="text-base font-bold tabular-nums text-foreground">
                #{questionNumber}
              </span>
            </div>

            {/* Controls & Lives / Mode */}
            <div className="flex items-center gap-3">
              {mode === 'lives' ? (
                <div
                  className="flex items-center gap-1.5"
                  role="img"
                  aria-label={`${lives} of ${maxLives} lives remaining`}
                >
                  {Array.from({ length: maxLives }).map((_, i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      animate={{
                        scale: i < lives ? 1 : 0.7,
                        opacity: i < lives ? 1 : 0.18,
                        filter: i < lives ? 'drop-shadow(0 0 4px rgba(239,68,68,0.55))' : 'none',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-lg"
                    >
                      ❤️
                    </motion.span>
                  ))}
                </div>
              ) : mode === 'best-of-100' ? (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-muted">
                    Progress
                  </span>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {questionNumber}{' '}
                    <span className="text-muted font-normal">/ 100</span>
                  </span>
                </div>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-500">
                  Survival
                </span>
              )}

              {onToggleSound && (
                <button
                  type="button"
                  onClick={onToggleSound}
                  title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                  aria-label={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                  className="flex items-center justify-center p-1.5 rounded-lg border border-border/80 bg-surface/50 hover:border-accent/40 text-muted hover:text-foreground transition-all cursor-pointer"
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
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="relative">
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--color-border)' }}
            role="progressbar"
            aria-label="Time remaining"
            aria-valuenow={timeLeft}
            aria-valuemin={0}
            aria-valuemax={totalSeconds}
          >
            <div
              className="h-full rounded-full w-full"
              style={{
                transform: `scaleX(${timerPercent / 100})`,
                transformOrigin: 'left',
                background: timerColor,
                boxShadow: isUrgent ? `0 0 10px ${timerColor}, 0 0 22px rgba(239,68,68,0.3)` : 'none',
                transition: 'transform 1s linear, background 0.4s ease, box-shadow 0.4s ease',
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 min-h-[28px]">
            {mode === 'best-of-100' && onForfeit ? (
              <div className="flex items-center min-h-[32px]">
                <AnimatePresence mode="wait">
                  {!confirmForfeit ? (
                    <motion.button
                      key="forfeit-btn"
                      type="button"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setConfirmForfeit(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-surface/40 cursor-pointer outline-hidden transition-all hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/8 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      whileHover={{ y: -0.5 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a1.5 1.5 0 001.205-1.46V5.334a1.5 1.5 0 00-1.748-1.479l-2.77.693a9 9 0 01-6.208-.682l-.108-.054a9 9 0 00-6.086-.71L3 4.5m0 10.5V4.5" />
                      </svg>
                      Forfeit Run
                    </motion.button>
                  ) : (
                    <motion.div
                      key="confirm-box"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      onMouseLeave={() => setConfirmForfeit(false)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs font-semibold text-red-500 mr-1">Forfeit round?</span>
                      <button
                        type="button"
                        onClick={onForfeit}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-[background-color,transform] duration-150 text-white bg-red-500 hover:bg-red-600 shadow-xs hover:scale-[1.02] active:scale-[0.98] outline-hidden focus-visible:ring-2 focus-visible:ring-red-450 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Yes, forfeit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmForfeit(false)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-[background-color,transform] duration-150 border hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground hover:scale-[1.02] active:scale-[0.98] outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        style={{
                          borderColor: 'var(--color-border)',
                        }}
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {answerState !== 'unanswered' && onSkipFeedback && (
                  <button
                    type="button"
                    onClick={onSkipFeedback}
                    className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Press Space / Enter to continue →
                  </button>
                )}
              </div>
            )}
            <span
              className={`text-xs font-mono font-bold tabular-nums transition-colors duration-300 ${
                isUrgent ? 'animate-pulse text-red-500' : 'text-muted'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        </div>
      </motion.div>

      {/* Question card with transition */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionNumber}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative bg-surface/95 dark:bg-surface/40 backdrop-blur-xl border border-border/80 dark:border-border/50 rounded-3xl p-6 md:p-8 shadow-lg shadow-black/5 dark:shadow-black/35 overflow-hidden">
              {/* Subtle glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent pointer-events-none rounded-3xl" />

              <div className="relative z-10">
                <QuestionCard
                  question={question}
                  answerState={answerState}
                  selectedAnswer={selectedAnswer}
                  onAnswer={onAnswer}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
