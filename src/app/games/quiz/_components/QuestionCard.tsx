'use client';

import { motion } from 'motion/react';
import type { QuizQuestion, AnswerState } from '@/types/quiz';

interface Props {
  question: QuizQuestion;
  answerState: AnswerState;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const DIFFICULTY: Record<string, { label: string; color: string; bg: string; border: string }> = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
  hard: { label: 'Hard', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
  'extra-hard': { label: 'Extra Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function QuestionCard({ question, answerState, selectedAnswer, onAnswer }: Props) {
  const isAnswered = answerState !== 'unanswered';
  const diff = DIFFICULTY[question.difficulty];

  const getOptionState = (index: number) => {
    if (!isAnswered) return 'idle';
    if (index === question.correctAnswer) return 'correct';
    if (index === selectedAnswer) return 'wrong';
    return 'dim';
  };

  const optionStyles: Record<string, { border: string; bg: string; text: string; labelBg: string; labelText: string; glow: string }> = {
    idle: {
      border: 'var(--color-border)',
      bg: 'transparent',
      text: 'var(--color-foreground)',
      labelBg: 'var(--color-background)',
      labelText: 'var(--color-muted)',
      glow: 'none',
    },
    correct: {
      border: '#22c55e',
      bg: 'rgba(34,197,94,0.08)',
      text: 'var(--color-foreground)',
      labelBg: '#22c55e',
      labelText: '#fff',
      glow: '0 0 0 1px rgba(34,197,94,0.2), 0 4px 18px rgba(34,197,94,0.14)',
    },
    wrong: {
      border: '#ef4444',
      bg: 'rgba(239,68,68,0.08)',
      text: 'var(--color-foreground)',
      labelBg: '#ef4444',
      labelText: '#fff',
      glow: '0 0 0 1px rgba(239,68,68,0.2), 0 4px 18px rgba(239,68,68,0.14)',
    },
    dim: {
      border: 'var(--color-border)',
      bg: 'transparent',
      text: 'var(--color-muted)',
      labelBg: 'var(--color-surface)',
      labelText: 'var(--color-border)',
      glow: 'none',
    },
  };

  return (
    <div className="w-full">
      {/* Metadata badges */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span
          className="text-xs font-medium px-3 py-1 rounded-full border"
          style={{ color: 'var(--color-muted)', background: 'var(--color-background)', borderColor: 'var(--color-border)' }}
        >
          {question.category}
        </span>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full border"
          style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
        >
          {diff.label}
        </span>
        {question.type === 'true-false' && (
          <span
            className="text-xs font-medium px-3 py-1 rounded-full border"
            style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.1)', borderColor: 'rgba(167,139,250,0.3)' }}
          >
            True / False
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="text-xl md:text-2xl font-semibold leading-snug mb-8 text-foreground text-pretty">
        {question.question}
      </p>

      {/* Options */}
      <div className={`grid gap-3 ${question.type === 'true-false' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {question.options.map((option, index) => {
          const state = getOptionState(index);
          const styles = optionStyles[state];
          return (
            <motion.button
              key={index}
              custom={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: state === 'dim' ? 0.38 : 1,
                x: 0,
                transition: { duration: 0.3, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
              }}
              whileHover={!isAnswered ? { x: 4, boxShadow: '0 0 0 1px rgba(0,199,88,0.28)', transition: { duration: 0.15 } } : undefined}
              whileTap={!isAnswered ? { scale: 0.98 } : undefined}
              disabled={isAnswered}
              onClick={() => onAnswer(index)}
              className="flex items-center gap-4 w-full p-4 rounded-xl border-2 text-left font-medium outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background"
              style={{
                borderColor: styles.border,
                background: styles.bg,
                color: styles.text,
                cursor: isAnswered ? 'default' : 'pointer',
                boxShadow: styles.glow,
                transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Letter label */}
              <span
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200"
                style={{ background: styles.labelBg, color: styles.labelText }}
              >
                {OPTION_LABELS[index]}
              </span>

              {/* Option text */}
              <span className="text-sm md:text-base flex-1">{option}</span>

              {/* Feedback icon */}
              {isAnswered && state === 'correct' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                  style={{ color: '#22c55e' }}
                >
                  <CheckIcon />
                </motion.span>
              )}
              {isAnswered && state === 'wrong' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                  style={{ color: '#ef4444' }}
                >
                  <XIcon />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
