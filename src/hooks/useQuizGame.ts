'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { QuizQuestion, GameMode, GamePhase, AnswerState } from '@/types/quiz';
import { QUESTIONS_BY_CATEGORY, type CategoryKey, getAllQuestions } from '@/data/quiz';

const TOTAL_LIVES = 3;
const TIMER_SECONDS = 15;
const FEEDBACK_DELAY_CORRECT_MS = 1200;
const FEEDBACK_DELAY_WRONG_MS = 3000;

const DIFFICULTY_POINTS: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  'extra-hard': 5,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useQuizGame() {
  const [phase, setPhase] = useState<GamePhase>('select');
  const [mode, setMode] = useState<GameMode | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTimeSpentMs, setTotalTimeSpentMs] = useState(0);

  // Refs for use inside async callbacks (avoid stale closures)
  const modeRef = useRef<GameMode | null>(null);
  const livesRef = useRef(TOTAL_LIVES);
  const questionsRef = useRef<QuizQuestion[]>([]);
  const currentIndexRef = useRef(0);
  const isProcessingRef = useRef(false);
  const pendingAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const questionStartTimeRef = useRef<number>(0);
  const totalTimeSpentMsRef = useRef(0);

  const clearPendingAdvance = useCallback(() => {
    if (pendingAdvanceRef.current) {
      clearTimeout(pendingAdvanceRef.current);
      pendingAdvanceRef.current = null;
    }
  }, []);

  const advanceToNext = useCallback(() => {
    const nextIdx = currentIndexRef.current + 1;
    let newIdx = nextIdx;

    if (nextIdx >= questionsRef.current.length) {
      const lastId = questionsRef.current[questionsRef.current.length - 1]?.id;
      let reshuffled = shuffle([...questionsRef.current]);
      // Avoid showing the same question twice in a row across the loop boundary
      if (reshuffled.length > 1 && reshuffled[0].id === lastId) {
        [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
      }
      questionsRef.current = reshuffled;
      setQuestions(reshuffled);
      newIdx = 0;
    }

    currentIndexRef.current = newIdx;
    isProcessingRef.current = false;
    questionStartTimeRef.current = Date.now();
    setCurrentIndex(newIdx);
    setAnswerState('unanswered');
    setSelectedAnswer(null);
    setTimeLeft(TIMER_SECONDS);
  }, []);

  const resolveAfterFeedback = useCallback(
    (isWrong: boolean, updatedLives: number) => {
      clearPendingAdvance();
      const delay = isWrong ? FEEDBACK_DELAY_WRONG_MS : FEEDBACK_DELAY_CORRECT_MS;
      pendingAdvanceRef.current = setTimeout(() => {
        const gameOver =
          (modeRef.current === 'survival' && isWrong) ||
          (modeRef.current === 'lives' && updatedLives <= 0);

        if (gameOver) {
          setPhase('result');
        } else {
          advanceToNext();
        }
      }, delay);
    },
    [clearPendingAdvance, advanceToNext]
  );

  // Timer: decrements timeLeft once per second; triggers timeout at 0
  useEffect(() => {
    if (phase !== 'playing' || answerState !== 'unanswered') return;

    if (timeLeft <= 0) {
      // Timeout — treat as wrong answer
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      let updatedLives = livesRef.current;
      if (modeRef.current === 'lives') {
        updatedLives = livesRef.current - 1;
        livesRef.current = updatedLives;
        setLives(updatedLives);
      }

      setSelectedAnswer(-1); // -1 signals timeout
      setAnswerState('incorrect');
      setTotalAnswered(prev => prev + 1);
      totalTimeSpentMsRef.current += TIMER_SECONDS * 1000;
      setTotalTimeSpentMs(totalTimeSpentMsRef.current);
      resolveAfterFeedback(true, updatedLives);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, answerState, timeLeft, resolveAfterFeedback]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      const question = questionsRef.current[currentIndexRef.current];
      const isCorrect = index === question.correctAnswer;
      const points = DIFFICULTY_POINTS[question.difficulty] ?? 1;

      setSelectedAnswer(index);
      setAnswerState(isCorrect ? 'correct' : 'incorrect');
      setTotalAnswered(prev => prev + 1);
      totalTimeSpentMsRef.current += Date.now() - questionStartTimeRef.current;
      setTotalTimeSpentMs(totalTimeSpentMsRef.current);

      if (isCorrect) {
        setScore(prev => prev + points);
        setCorrectCount(prev => prev + 1);
      }

      let updatedLives = livesRef.current;
      if (!isCorrect && modeRef.current === 'lives') {
        updatedLives = livesRef.current - 1;
        livesRef.current = updatedLives;
        setLives(updatedLives);
      }

      resolveAfterFeedback(!isCorrect, updatedLives);
    },
    [resolveAfterFeedback]
  );

  const startGame = useCallback(
    (selectedMode: GameMode, category?: CategoryKey) => {
      clearPendingAdvance();

      const questionsToUse = category
        ? QUESTIONS_BY_CATEGORY[category]
        : getAllQuestions();

      const shuffled = shuffle(questionsToUse as QuizQuestion[]);

      modeRef.current = selectedMode;
      livesRef.current = TOTAL_LIVES;
      questionsRef.current = shuffled;
      currentIndexRef.current = 0;
      isProcessingRef.current = false;

      setMode(selectedMode);
      setPhase('playing');
      setQuestions(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setLives(TOTAL_LIVES);
      setAnswerState('unanswered');
      setSelectedAnswer(null);
      setTimeLeft(TIMER_SECONDS);
      setTotalAnswered(0);
      setCorrectCount(0);
      setTotalTimeSpentMs(0);
      totalTimeSpentMsRef.current = 0;
      questionStartTimeRef.current = Date.now();
    },
    [clearPendingAdvance]
  );

  const resetGame = useCallback(() => {
    clearPendingAdvance();
    modeRef.current = null;
    livesRef.current = TOTAL_LIVES;
    questionsRef.current = [];
    currentIndexRef.current = 0;
    isProcessingRef.current = false;

    setPhase('select');
    setMode(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setLives(TOTAL_LIVES);
    setAnswerState('unanswered');
    setSelectedAnswer(null);
    setTimeLeft(TIMER_SECONDS);
    setTotalAnswered(0);
    setCorrectCount(0);
    setTotalTimeSpentMs(0);
    totalTimeSpentMsRef.current = 0;
    questionStartTimeRef.current = 0;
  }, [clearPendingAdvance]);

  // Cleanup on unmount
  useEffect(() => () => clearPendingAdvance(), [clearPendingAdvance]);

  return {
    phase,
    mode,
    currentQuestion: questions[currentIndex] ?? null,
    questionNumber: currentIndex + 1,
    score,
    lives,
    maxLives: TOTAL_LIVES,
    answerState,
    selectedAnswer,
    timeLeft,
    totalSeconds: TIMER_SECONDS,
    totalAnswered,
    correctCount,
    avgSecondsPerQuestion:
      totalAnswered > 0
        ? Math.round((totalTimeSpentMs / totalAnswered / 1000) * 10) / 10
        : 0,
    startGame,
    handleAnswer,
    resetGame,
    playAgain: () => mode && startGame(mode),
    availableCategories: Object.keys(QUESTIONS_BY_CATEGORY) as CategoryKey[],
  };
}

export { QUESTIONS_BY_CATEGORY, type CategoryKey };
