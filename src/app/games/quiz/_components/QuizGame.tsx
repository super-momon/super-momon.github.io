'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { QuizQuestion, GameMode, AnswerState } from '@/types/quiz';
import { QuestionCard } from './QuestionCard';

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  score: number;
  lives: number;
  maxLives: number;
  mode: GameMode;
  answerState: AnswerState;
  selectedAnswer: number | null;
  timeLeft: number;
  totalSeconds: number;
  onAnswer: (index: number) => void;
}

export function QuizGame({
  question,
  questionNumber,
  score,
  lives,
  maxLives,
  mode,
  answerState,
  selectedAnswer,
  timeLeft,
  totalSeconds,
  onAnswer,
}: Props) {
  const timerPercent = Math.max(0, (timeLeft / totalSeconds) * 100);
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && timeLeft > 5;

  const timerColor = isUrgent
    ? '#ef4444'
    : isWarning
      ? '#f59e0b'
      : 'var(--color-accent)';

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 pb-16 px-4">
      {/* Header bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl mb-4"
      >
        <div
          className="flex items-center justify-between px-5 py-3 rounded-2xl border mb-3"
          style={{
            background: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderColor: 'var(--color-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Score */}
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

          {/* Question number */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-muted">
              Question
            </span>
            <span className="text-base font-bold tabular-nums text-foreground">
              #{questionNumber}
            </span>
          </div>

          {/* Lives / Mode */}
          {mode === 'lives' ? (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxLives }).map((_, i) => (
                <motion.span
                  key={i}
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
              <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-muted)' }}>
                Progress
              </span>
              <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-foreground)' }}>
                {questionNumber}{' '}
                <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>/ 100</span>
              </span>
            </div>
          ) : (
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{
                color: '#f97316',
                borderColor: 'rgba(249,115,22,0.4)',
                background: 'rgba(249,115,22,0.08)',
              }}
            >
              Survival
            </span>
          )}
        </div>

        {/* Timer bar */}
        <div className="relative">
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--color-border)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${timerPercent}%`,
                background: timerColor,
                boxShadow: isUrgent ? `0 0 10px ${timerColor}, 0 0 22px rgba(239,68,68,0.3)` : 'none',
                transition: 'width 1s linear, background 0.4s ease, box-shadow 0.4s ease',
              }}
            />
          </div>
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs font-mono font-bold tabular-nums transition-colors duration-300 ${isUrgent ? 'animate-pulse' : ''
                }`}
              style={{ color: isUrgent ? '#ef4444' : 'var(--color-muted)' }}
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
            <div
              className="rounded-2xl border p-6 md:p-8"
              style={{
                background: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'var(--color-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <QuestionCard
                question={question}
                answerState={answerState}
                selectedAnswer={selectedAnswer}
                onAnswer={onAnswer}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

