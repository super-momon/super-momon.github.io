import type { GameMode } from './quiz';

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  mode: GameMode;
  correct_count: number;
  total_answered: number;
  avg_time_per_question: number;
  created_at: string;
}

export interface SubmitScorePayload {
  nickname: string;
  score: number;
  mode: GameMode;
  correct_count: number;
  total_answered: number;
  avg_time_per_question: number;
}
