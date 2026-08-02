'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faRotateRight,
  faSliders,
  faShareNodes,
  faCheck,
  faFire,
  faBolt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { GameMode } from '@/types/quiz';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { NicknameModal } from './NicknameModal';
import { LeaderboardModal } from './LeaderboardModal';

interface Props {
  score: number;
  totalAnswered: number;
  correctCount: number;
  totalQuestions: number;
  avgSecondsPerQuestion: number;
  maxStreak?: number;
  mode: GameMode;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}

function getRating(accuracy: number) {
  if (accuracy >= 90) return { label: 'Legendary', color: '#f59e0b' };
  if (accuracy >= 75) return { label: 'Expert', color: '#8b5cf6' };
  if (accuracy >= 60) return { label: 'Solid Run', color: '#3b82f6' };
  if (accuracy >= 40) return { label: 'Keep Grinding', color: '#f97316' };
  return { label: 'Keep Learning', color: '#ef4444' };
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
}

export function ResultScreen({
  score,
  totalAnswered,
  correctCount,
  totalQuestions,
  avgSecondsPerQuestion,
  maxStreak = 0,
  mode,
  onPlayAgain,
  onChangeMode,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<LeaderboardEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const accuracy =
    mode === 'best-of-100'
      ? totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0
      : totalAnswered > 0
        ? Math.round((correctCount / totalAnswered) * 100)
        : 0;

  const rating = getRating(accuracy);
  const displayScore = useCountUp(score);
  const modeLabel =
    mode === 'survival' ? 'Survival' : mode === 'lives' ? '3 Lives' : 'Best of 100';

  const handleCopyShare = () => {
    const text = `🏆 Quizzed on ${modeLabel} in Developer Quiz!\nScore: ${score} | Accuracy: ${accuracy}% | Max Streak: 🔥 ${maxStreak}\nCan you beat my score? https://super-momon.github.io/games/quiz`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-12"
    >
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-[var(--color-border)]/80 bg-[var(--color-surface)]/80 backdrop-blur-xl text-center">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Winner / Header Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-20 h-20 bg-[var(--color-accent)]/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-accent)]/20 shadow-xl"
        >
          <FontAwesomeIcon icon={faTrophy} className="w-10 h-10 text-[var(--color-accent)]" />
        </motion.div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)] mb-1">
          Quiz Completed!
        </h1>
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-extrabold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
            {rating.label} Performance ({accuracy}% Accuracy)
          </span>
        </div>

        {/* Score Showcase Panel */}
        <div className="bg-[var(--color-surface)]/60 border border-[var(--color-border)]/60 rounded-2xl p-6 mb-6">
          <div className="text-xs uppercase font-extrabold text-[var(--color-muted)] tracking-wider mb-1">
            Final Score
          </div>
          <div className="text-5xl font-extrabold text-[var(--color-accent)] tracking-tight tabular-nums">
            {displayScore}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[var(--color-surface)]/40 p-3.5 rounded-2xl border border-[var(--color-border)]/40 text-center">
            <div className="text-[10px] uppercase font-extrabold text-[var(--color-muted)] tracking-wider">
              Answered
            </div>
            <div className="text-xl font-extrabold text-[var(--color-foreground)] tabular-nums mt-0.5">
              {totalAnswered}
            </div>
          </div>

          <div className="bg-[var(--color-surface)]/40 p-3.5 rounded-2xl border border-[var(--color-border)]/40 text-center">
            <div className="text-[10px] uppercase font-extrabold text-[var(--color-muted)] tracking-wider">
              Correct
            </div>
            <div className="text-xl font-extrabold text-[#08ca5f] tabular-nums mt-0.5">
              {correctCount}
            </div>
          </div>

          <div className="bg-[var(--color-surface)]/40 p-3.5 rounded-2xl border border-[var(--color-border)]/40 text-center">
            <div className="text-[10px] uppercase font-extrabold text-[var(--color-muted)] tracking-wider">
              Max Streak
            </div>
            <div className="text-xl font-extrabold text-amber-400 tabular-nums mt-0.5 flex items-center justify-center gap-1">
              <FontAwesomeIcon icon={faFire} className="text-xs" />
              {maxStreak}
            </div>
          </div>

          <div className="bg-[var(--color-surface)]/40 p-3.5 rounded-2xl border border-[var(--color-border)]/40 text-center">
            <div className="text-[10px] uppercase font-extrabold text-[var(--color-muted)] tracking-wider">
              Avg Speed
            </div>
            <div className="text-xl font-extrabold text-sky-400 tabular-nums mt-0.5">
              {avgSecondsPerQuestion}s
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Play Again Primary Button */}
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-4 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-extrabold shadow-lg shadow-[var(--color-accent)]/20 flex items-center justify-center gap-2 text-base transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateRight} />
            Play Again
          </button>

          {/* Submit to Leaderboard Button */}
          {!submittedEntry ? (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faTrophy} />
              Submit Score to Leaderboard
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-bold flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} />
              Submitted as #{submittedEntry.nickname}!
            </div>
          )}

          {/* Share & Change Mode Secondary Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCopyShare}
              className="flex-1 py-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-foreground)] font-bold text-sm bg-[var(--color-surface)]/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={copied ? faCheck : faShareNodes} className={copied ? 'text-[#08ca5f]' : ''} />
              {copied ? 'Link Copied!' : 'Share Score'}
            </button>

            <button
              type="button"
              onClick={onChangeMode}
              className="flex-1 py-3.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-foreground)] font-bold text-sm bg-[var(--color-surface)]/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faSliders} />
              Change Mode
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Submission & View Modals */}
      {showModal && (
        <NicknameModal
          score={score}
          mode={mode}
          correctCount={correctCount}
          totalAnswered={totalAnswered}
          avgTimePerQuestion={avgSecondsPerQuestion}
          onSuccess={(entry) => {
            setSubmittedEntry(entry);
            setShowModal(false);
            setShowLeaderboard(true);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          open={showLeaderboard}
          initialMode={mode}
          highlightId={submittedEntry?.id}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </motion.div>
  );
}
