'use client';

import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faTag, faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
import type { QuizQuestion, AnswerState } from '@/types/quiz';

interface Props {
  question: QuizQuestion;
  answerState: AnswerState;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const OPTION_KEYS = ['1', '2', '3', '4'];

const DIFFICULTY: Record<string, { label: string; color: string; bg: string; border: string }> = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
  hard: { label: 'Hard', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
  'extra-hard': { label: 'Extra Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

function renderFormattedText(text: string) {
  if (!text.includes('`')) return text;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const code = part.slice(1, -1);
      return (
        <code
          key={i}
          className="font-mono font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/15 px-2 py-0.5 rounded-lg border border-[var(--color-accent)]/30 text-[0.88em] mx-1"
        >
          {code}
        </code>
      );
    }
    return part;
  });
}

export function QuestionCard({ question, answerState, selectedAnswer, onAnswer }: Props) {
  const isAnswered = answerState !== 'unanswered';
  const diff = DIFFICULTY[question.difficulty] ?? DIFFICULTY.easy;

  const getOptionState = (index: number) => {
    if (!isAnswered) return 'idle';
    if (index === question.correctAnswer) return 'correct';
    if (index === selectedAnswer) return 'wrong';
    return 'dim';
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-[var(--color-border)]/80 bg-[var(--color-surface)]/80 backdrop-blur-xl">
      {/* Background Glow matching Chain Reaction */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 inline-flex items-center gap-1.5 uppercase tracking-wider">
          <FontAwesomeIcon icon={faTag} className="text-[10px]" />
          {question.category}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs font-extrabold border inline-flex items-center gap-1.5 uppercase tracking-wider"
          style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
        >
          <FontAwesomeIcon icon={faGaugeHigh} className="text-[10px]" />
          {diff.label}
        </span>
        {question.type === 'true-false' && (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold border border-purple-500/30 bg-purple-500/10 text-purple-400 uppercase tracking-wider">
            True / False
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-foreground)] leading-snug tracking-tight my-6 text-pretty">
        {renderFormattedText(question.question)}
      </h2>

      {/* Answer Options Grid */}
      <div
        className={`grid gap-3 ${question.type === 'true-false' ? 'grid-cols-2' : 'grid-cols-1'}`}
        role="group"
        aria-label="Quiz options"
      >
        {question.options.map((option, index) => {
          const state = getOptionState(index);
          const isSelected = selectedAnswer === index;
          const isWrongSelection = isAnswered && isSelected && index !== question.correctAnswer;

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: state === 'dim' ? 0.35 : 1,
                x: isWrongSelection ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
                transition: {
                  duration: isWrongSelection ? 0.4 : 0.25,
                  delay: isWrongSelection ? 0 : index * 0.05,
                },
              }}
              whileHover={!isAnswered ? { x: 4 } : undefined}
              disabled={isAnswered}
              onClick={() => onAnswer(index)}
              className={`group relative flex items-center gap-4 w-full p-4 rounded-xl border-2 text-left font-bold transition-all duration-200 cursor-pointer overflow-hidden ${
                state === 'idle'
                  ? 'border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-foreground)] hover:border-[var(--color-accent)]/60 hover:bg-[var(--color-surface)]'
                  : state === 'correct'
                    ? 'border-[#08ca5f] bg-[#08ca5f]/15 text-[var(--color-foreground)] shadow-lg shadow-[#08ca5f]/20'
                    : state === 'wrong'
                      ? 'border-[#ef4444] bg-[#ef4444]/15 text-[var(--color-foreground)] shadow-lg shadow-[#ef4444]/20'
                      : 'border-[var(--color-border)]/30 bg-transparent text-[var(--color-muted)] opacity-30 cursor-default'
              }`}
            >
              {/* Option Letter Label Box */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold font-mono transition-all border ${
                    state === 'correct'
                      ? 'bg-[#08ca5f] text-black border-[#08ca5f]'
                      : state === 'wrong'
                        ? 'bg-[#ef4444] text-white border-[#ef4444]'
                        : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]/50 group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/40'
                  }`}
                >
                  {OPTION_LABELS[index]}
                </span>
                {!isAnswered && (
                  <span className="hidden sm:inline-block text-[10px] font-mono text-[var(--color-muted)]/50 px-1.5 py-0.5 border border-[var(--color-border)]/40 rounded-lg">
                    {OPTION_KEYS[index]}
                  </span>
                )}
              </div>

              {/* Option Text */}
              <span className="text-sm sm:text-base flex-1 pr-2 leading-relaxed font-semibold">
                {renderFormattedText(option)}
              </span>

              {/* Feedback Status Icon */}
              {isAnswered && (
                <div className="shrink-0 text-lg">
                  {state === 'correct' && (
                    <FontAwesomeIcon icon={faCheck} className="text-[#08ca5f]" />
                  )}
                  {state === 'wrong' && (
                    <FontAwesomeIcon icon={faXmark} className="text-[#ef4444]" />
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
