export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'extra-hard';
export type QuestionType = 'multiple-choice' | 'true-false';
export type GameMode = 'survival' | 'lives' | 'best-of-100';
export type GamePhase = 'select' | 'playing' | 'result';
export type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  question: string;
  /** For multiple-choice: 4 options. For true-false: ["True", "False"] */
  options: string[];
  /** Zero-based index into options[] */
  correctAnswer: number;
}
