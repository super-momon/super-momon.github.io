'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faFire,
  faHeart,
  faVolumeUp,
  faVolumeMute,
  faFlag,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
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

  const timerBg = isUrgent ? '#ef4444' : isWarning ? '#f59e0b' : 'var(--color-accent)';

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (answerState !== 'unanswered') {
        if ((e.key === ' ' || e.key === 'Enter') && onSkipFeedback) {
          e.preventDefault();
          onSkipFeedback();
        }
        return;
      }

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
    <div className="w-full max-w-2xl mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-12">
      {/* Header bar styled matching Chain Reaction control panels */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden border border-[var(--color-border)]/80 bg-[var(--color-surface)]/80 backdrop-blur-xl mb-4"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
          {/* Score & Streak */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold text-base">
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--color-muted)] block">
                  Score
                </span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={score}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="text-xl font-extrabold tabular-nums text-[var(--color-accent)]"
                  >
                    {score}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-500/10 border border-amber-500/30 text-amber-400"
              >
                <FontAwesomeIcon icon={faFire} className="text-amber-400" />
                <span>{streak} Streak</span>
              </motion.div>
            )}
          </div>

          {/* Question Counter */}
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--color-muted)] block">
              Question
            </span>
            <span className="text-base font-extrabold tabular-nums text-[var(--color-foreground)]">
              #{questionNumber}
            </span>
          </div>

          {/* Lives / Mode Badge & Actions */}
          <div className="flex items-center gap-3">
            {mode === 'lives' ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: maxLives }).map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faHeart}
                    className={`text-base transition-all ${
                      i < lives
                        ? 'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                        : 'text-[var(--color-muted)]/30'
                    }`}
                  />
                ))}
              </div>
            ) : mode === 'best-of-100' ? (
              <span className="text-xs font-extrabold font-mono text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2.5 py-1 rounded-xl border border-[var(--color-accent)]/20">
                {questionNumber}/100
              </span>
            ) : (
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                Survival
              </span>
            )}

            {/* Sound Toggle */}
            {onToggleSound && (
              <button
                type="button"
                onClick={onToggleSound}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                className="w-9 h-9 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-surface)]/50 text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center justify-center transition-all cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={soundEnabled ? faVolumeUp : faVolumeMute}
                  className={soundEnabled ? 'text-[var(--color-accent)]' : ''}
                />
              </button>
            )}

            {/* Forfeit / Exit Game Button */}
            {onForfeit && (
              <button
                type="button"
                onClick={() => {
                  if (confirmForfeit) {
                    onForfeit();
                  } else {
                    setConfirmForfeit(true);
                    setTimeout(() => setConfirmForfeit(false), 3000);
                  }
                }}
                className={`py-1.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  confirmForfeit
                    ? 'bg-red-500 text-white border-red-500 shadow-md'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]/50 text-[var(--color-muted)] hover:text-red-400 hover:border-red-500/40'
                }`}
              >
                <FontAwesomeIcon icon={faFlag} />
                <span>{confirmForfeit ? 'Confirm?' : 'Quit'}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Timer Bar matching Chain Reaction style */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between text-xs font-extrabold text-[var(--color-muted)] mb-1.5 px-1">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} className={isUrgent ? 'text-red-500 animate-pulse' : ''} />
            Time Remaining
          </span>
          <span className={`font-mono tabular-nums ${isUrgent ? 'text-red-500 font-bold' : ''}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${timerPercent}%`,
              backgroundColor: timerBg,
              boxShadow: isUrgent ? '0 0 10px rgba(239,68,68,0.5)' : 'none',
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <QuestionCard
        question={question}
        answerState={answerState}
        selectedAnswer={selectedAnswer}
        onAnswer={onAnswer}
      />
    </div>
  );
}
