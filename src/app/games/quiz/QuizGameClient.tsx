'use client';

import { useState, useEffect } from 'react';
import { useQuizGame } from '@/hooks/useQuizGame';
import { ModeSelect } from './_components/ModeSelect';
import { QuizGame } from './_components/QuizGame';
import { ResultScreen } from './_components/ResultScreen';
import { LeaderboardModal } from './_components/LeaderboardModal';
import { trackEvent } from '@/lib/analytics';

export default function QuizPage() {
  const game = useQuizGame();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  useEffect(() => {
    trackEvent('game_visit', { game_name: 'quiz' });
  }, []);

  return (
    <div className="relative">
      {/* Ambient background — fixed so it persists across all quiz screens */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Top-left accent orb */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-15%',
            width: '60%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(0,199,88,0.1) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Bottom-right indigo orb */}
        <div
          style={{
            position: 'absolute',
            bottom: '-25%',
            right: '-15%',
            width: '55%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Mid purple accent */}
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            width: '40%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Subtle dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(100,116,139,0.1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {game.phase === 'select' && (
          <ModeSelect
            onStart={game.startGame}
            onOpenLeaderboard={() => setLeaderboardOpen(true)}
          />
        )}

        {game.phase === 'playing' && game.currentQuestion && (
          <QuizGame
            question={game.currentQuestion}
            questionNumber={game.questionNumber}
            score={game.score}
            lives={game.lives}
            maxLives={game.maxLives}
            mode={game.mode!}
            answerState={game.answerState}
            selectedAnswer={game.selectedAnswer}
            timeLeft={game.timeLeft}
            totalSeconds={game.totalSeconds}
            onAnswer={game.handleAnswer}
            onForfeit={game.forfeitGame}
          />
        )}

        {game.phase === 'result' && (
          <ResultScreen
            score={game.score}
            totalAnswered={game.totalAnswered}
            correctCount={game.correctCount}
            totalQuestions={game.totalQuestions}
            avgSecondsPerQuestion={game.avgSecondsPerQuestion}
            mode={game.mode!}
            onPlayAgain={game.playAgain}
            onChangeMode={game.resetGame}
          />
        )}
      </div>

      <LeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
    </div>
  );
}
