'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { QuizQuestion, GameMode, GamePhase, AnswerState, QuestionDifficulty } from '@/types/quiz';
import { QUESTIONS_BY_CATEGORY, type CategoryKey, getAllQuestions } from '@/data/quiz';
import { trackEvent } from '@/lib/analytics';
import { quizAudio } from '@/app/games/quiz/_components/QuizAudioSynth';

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
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTimeSpentMs, setTotalTimeSpentMs] = useState(0);
  const [activeCategories, setActiveCategories] = useState<CategoryKey[]>([]);
  const [activeDifficulties, setActiveDifficulties] = useState<QuestionDifficulty[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync sound status on mount
  useEffect(() => {
    setSoundEnabled(quizAudio.isSoundEnabled());
  }, []);

  const handleToggleSound = useCallback(() => {
    const updated = quizAudio.toggleSound();
    setSoundEnabled(updated);
  }, []);

  // Refs for async callbacks
  const modeRef = useRef<GameMode | null>(null);
  const livesRef = useRef(TOTAL_LIVES);
  const streakRef = useRef(0);
  const maxStreakRef = useRef(0);
  const questionsRef = useRef<QuizQuestion[]>([]);
  const currentIndexRef = useRef(0);
  const isProcessingRef = useRef(false);
  const pendingAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTargetRef = useRef<'next' | 'result' | null>(null);
  const questionStartTimeRef = useRef<number>(0);
  const totalTimeSpentMsRef = useRef(0);
  const activeCategoriesRef = useRef<CategoryKey[]>([]);
  const activeDifficultiesRef = useRef<QuestionDifficulty[]>([]);

  const clearPendingAdvance = useCallback(() => {
    if (pendingAdvanceRef.current) {
      clearTimeout(pendingAdvanceRef.current);
      pendingAdvanceRef.current = null;
    }
    nextTargetRef.current = null;
  }, []);

  const forfeitGame = useCallback(() => {
    trackEvent('quiz_forfeit', {
      mode: modeRef.current || 'unknown',
      score,
      answered: totalAnswered,
      question_number: currentIndexRef.current + 1,
    });
    clearPendingAdvance();
    setPhase('result');
  }, [clearPendingAdvance, score, totalAnswered]);

  const advanceToNext = useCallback(() => {
    const nextIdx = currentIndexRef.current + 1;
    let newIdx = nextIdx;

    if (nextIdx >= questionsRef.current.length) {
      const lastId = questionsRef.current[questionsRef.current.length - 1]?.id;
      let reshuffled = shuffle([...questionsRef.current]);
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

      const gameOver =
        (modeRef.current === 'survival' && isWrong) ||
        (modeRef.current === 'lives' && updatedLives <= 0) ||
        (modeRef.current === 'best-of-100' && currentIndexRef.current >= questionsRef.current.length - 1);

      nextTargetRef.current = gameOver ? 'result' : 'next';

      pendingAdvanceRef.current = setTimeout(() => {
        if (gameOver) {
          quizAudio.playVictory();
          setPhase('result');
        } else {
          advanceToNext();
        }
      }, delay);
    },
    [clearPendingAdvance, advanceToNext]
  );

  // Manual skip feedback (when pressing Space/Enter)
  const skipFeedback = useCallback(() => {
    if (!nextTargetRef.current) return;
    const target = nextTargetRef.current;
    clearPendingAdvance();
    if (target === 'result') {
      quizAudio.playVictory();
      setPhase('result');
    } else {
      advanceToNext();
    }
  }, [clearPendingAdvance, advanceToNext]);

  // Timer loop
  useEffect(() => {
    if (phase !== 'playing' || answerState !== 'unanswered') return;

    if (timeLeft <= 5 && timeLeft > 0) {
      quizAudio.playTick();
    }

    if (timeLeft <= 0) {
      // Timeout
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      let updatedLives = livesRef.current;
      if (modeRef.current === 'lives') {
        updatedLives = livesRef.current - 1;
        livesRef.current = updatedLives;
        setLives(updatedLives);
      }

      streakRef.current = 0;
      setStreak(0);
      quizAudio.playWrong();

      setSelectedAnswer(-1);
      setAnswerState('incorrect');
      setTotalAnswered((prev) => prev + 1);
      totalTimeSpentMsRef.current += TIMER_SECONDS * 1000;
      setTotalTimeSpentMs(totalTimeSpentMsRef.current);
      resolveAfterFeedback(true, updatedLives);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, answerState, timeLeft, resolveAfterFeedback]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      const question = questionsRef.current[currentIndexRef.current];
      const isCorrect = index === question.correctAnswer;
      const basePoints = DIFFICULTY_POINTS[question.difficulty] ?? 1;

      setSelectedAnswer(index);
      setAnswerState(isCorrect ? 'correct' : 'incorrect');
      setTotalAnswered((prev) => prev + 1);
      totalTimeSpentMsRef.current += Date.now() - questionStartTimeRef.current;
      setTotalTimeSpentMs(totalTimeSpentMsRef.current);

      if (isCorrect) {
        const newStreak = streakRef.current + 1;
        streakRef.current = newStreak;
        setStreak(newStreak);
        if (newStreak > maxStreakRef.current) {
          maxStreakRef.current = newStreak;
          setMaxStreak(newStreak);
        }

        // Streak bonus point (+1 bonus for every 3 consecutive correct)
        const streakBonus = Math.floor(newStreak / 3);
        const earnedPoints = basePoints + streakBonus;

        setScore((prev) => prev + earnedPoints);
        setCorrectCount((prev) => prev + 1);

        if (newStreak >= 3) {
          quizAudio.playStreak();
        } else {
          quizAudio.playCorrect();
        }
      } else {
        streakRef.current = 0;
        setStreak(0);
        quizAudio.playWrong();
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
    (selectedMode: GameMode, categories: CategoryKey[], difficulties: QuestionDifficulty[]) => {
      clearPendingAdvance();
      quizAudio.playStart();

      trackEvent('game_play', {
        game_name: 'quiz',
        mode: selectedMode,
        categories: categories.join(',') || 'all',
        difficulties: difficulties.join(',') || 'all',
      });

      activeCategoriesRef.current = categories;
      activeDifficultiesRef.current = difficulties;
      setActiveCategories(categories);
      setActiveDifficulties(difficulties);

      let questionsToUse: QuizQuestion[] = [];
      if (categories.length > 0) {
        categories.forEach((cat) => {
          if (QUESTIONS_BY_CATEGORY[cat]) {
            questionsToUse.push(...(QUESTIONS_BY_CATEGORY[cat] as QuizQuestion[]));
          }
        });
      } else {
        questionsToUse = getAllQuestions() as QuizQuestion[];
      }

      if (difficulties.length > 0) {
        questionsToUse = questionsToUse.filter((q) => difficulties.includes(q.difficulty));
      }

      if (questionsToUse.length === 0) {
        questionsToUse = getAllQuestions() as QuizQuestion[];
      }

      const shuffled = shuffle(questionsToUse);
      const finalQuestions = selectedMode === 'best-of-100' ? shuffled.slice(0, 100) : shuffled;

      modeRef.current = selectedMode;
      livesRef.current = TOTAL_LIVES;
      streakRef.current = 0;
      maxStreakRef.current = 0;
      questionsRef.current = finalQuestions;
      currentIndexRef.current = 0;
      isProcessingRef.current = false;

      setMode(selectedMode);
      setPhase('playing');
      setQuestions(finalQuestions);
      setCurrentIndex(0);
      setScore(0);
      setLives(TOTAL_LIVES);
      setStreak(0);
      setMaxStreak(0);
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
    streakRef.current = 0;
    maxStreakRef.current = 0;
    questionsRef.current = [];
    currentIndexRef.current = 0;
    isProcessingRef.current = false;
    activeCategoriesRef.current = [];
    activeDifficultiesRef.current = [];

    setPhase('select');
    setMode(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setLives(TOTAL_LIVES);
    setStreak(0);
    setMaxStreak(0);
    setAnswerState('unanswered');
    setSelectedAnswer(null);
    setTimeLeft(TIMER_SECONDS);
    setTotalAnswered(0);
    setCorrectCount(0);
    setTotalTimeSpentMs(0);
    totalTimeSpentMsRef.current = 0;
    questionStartTimeRef.current = 0;
    setActiveCategories([]);
    setActiveDifficulties([]);
  }, [clearPendingAdvance]);

  useEffect(() => () => clearPendingAdvance(), [clearPendingAdvance]);

  useEffect(() => {
    if (phase !== 'result' || !modeRef.current) return;

    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    trackEvent('game_complete', {
      game_name: 'quiz',
      mode: modeRef.current,
      score,
      answered: totalAnswered,
      correct: correctCount,
      accuracy,
      max_streak: maxStreakRef.current,
    });
  }, [phase, score, totalAnswered, correctCount]);

  return {
    phase,
    mode,
    currentQuestion: questions[currentIndex] ?? null,
    questionNumber: currentIndex + 1,
    score,
    lives,
    maxLives: TOTAL_LIVES,
    streak,
    maxStreak,
    answerState,
    selectedAnswer,
    timeLeft,
    totalSeconds: TIMER_SECONDS,
    totalAnswered,
    correctCount,
    totalQuestions: questions.length,
    avgSecondsPerQuestion:
      totalAnswered > 0
        ? Math.round((totalTimeSpentMs / totalAnswered / 1000) * 10) / 10
        : 0,
    soundEnabled,
    toggleSound: handleToggleSound,
    skipFeedback,
    startGame,
    handleAnswer,
    resetGame,
    forfeitGame,
    playAgain: () => mode && startGame(mode, activeCategoriesRef.current, activeDifficultiesRef.current),
    availableCategories: Object.keys(QUESTIONS_BY_CATEGORY) as CategoryKey[],
  };
}

export { QUESTIONS_BY_CATEGORY, type CategoryKey };
